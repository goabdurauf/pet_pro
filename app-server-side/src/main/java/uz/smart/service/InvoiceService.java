package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.InvoiceDto;
import uz.smart.entity.*;
import uz.smart.entity.enums.BalanceType;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ResInvoice;
import uz.smart.repository.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class InvoiceService {

    @Autowired
    InvoiceRepository repository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    ExpenseRepository expenseRepository;
    @Autowired
    ShippingRepository shippingRepository;
    @Autowired
    CarrierRepository carrierRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    CargoRepository cargoRepository;
    @Autowired
    BalancesRepository balancesRepository;
    @Autowired
    MapperUtil mapperUtil;

    public HttpEntity<?> saveInvoice(InvoiceDto dto) {
        InvoiceEntity entity = dto.getId() == null
                ? mapperUtil.toInvoiceEntity(dto, new InvoiceEntity())
                : mapperUtil.toInvoiceEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dto.getId())));
        entity.setBalance(BigDecimal.ZERO.subtract(entity.getPrice()));
        entity = repository.saveAndFlush(entity);
        if (dto.getCurrencyId() != null) {
            ListEntity currency = listRepository.findById(dto.getCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
            entity.setCurrencyName(currency.getNameRu());
        }
        if (dto.getShippingId() != null) {
            ShippingEntity shipping = shippingRepository.findById(dto.getShippingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", dto.getShippingId()));
            entity.setShipping(shipping);
            entity.setCarrierId(shipping.getCarrierId());
            if (dto.getType() == 1) {
                shipping.setInvoiceInId(entity.getId());
                shippingRepository.save(shipping);
            }
        }
        if (dto.getOrderId() != null) {
            OrderEntity order = orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "id", dto.getOrderId()));
            entity.setClientId(order.getClientId());
        }
        entity = repository.saveAndFlush(entity);
        if (dto.getExpenseId() != null && dto.getType() != 5) {
            ExpenseEntity expense = expenseRepository.findById(dto.getExpenseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", dto.getExpenseId()));
            entity.setCarrierId(expense.getCarrier().getId());

            if (entity.getType() == 1 || entity.getType() == 2 || entity.getType() == 3) {
                expense.setInvoiceInId(entity.getId());
                entity.setClientId(null);
            } else {
                expense.setInvoiceOutId(entity.getId());
                entity.setCarrierId(null);
            }

            if (entity.getType() == 3 || entity.getType() == 4)
                cargoRepository.findByExpenseListIn(List.of(expense)).ifPresent(entity::setCargo);

            expenseRepository.saveAndFlush(expense);

            entity = repository.saveAndFlush(entity);
        }
        if (dto.getType() == 5) {
            CargoEntity cargo = cargoRepository.findById(dto.getExpenseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", dto.getExpenseId()));
            entity.setCargo(cargo);
            entity.setCarrierId(null);
            entity = repository.saveAndFlush(entity);

            cargo.setInvoiceOutId(entity.getId());
            cargoRepository.saveAndFlush(cargo);
        }

        BalancesEntity bEntity = entity.getType() == 1 || entity.getType() == 2 || entity.getType() == 3
            ? balancesRepository.findById(new BalancesEntityPK(entity.getCarrierId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(entity.getCarrierId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier))
            : balancesRepository.findById(new BalancesEntityPK(entity.getClientId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(entity.getClientId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));

        bEntity.setBalance(bEntity.getBalance().add(entity.getPrice()));
        balancesRepository.save(bEntity);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> updateInvoice(InvoiceDto dto) {
        InvoiceEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dto.getId()));
        if (dto.getCurrencyId() != null) {
            ListEntity currency = listRepository.findById(dto.getCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
            entity.setCurrencyName(currency.getNameRu());
        }
        entity.setCurrencyId(dto.getCurrencyId());
        entity.setPrice(dto.getPrice());
        entity.setRate(dto.getRate());
        entity.setBalance(BigDecimal.ZERO.subtract(dto.getPrice().subtract(entity.getPrice().add(entity.getBalance()))));
        entity.setFinalPrice(dto.getFinalPrice());
        entity.setComment(dto.getComment());
        repository.save(entity);

        return ResponseEntity.ok().body(new ApiResponse("Изменено успешно", true));
    }

    public ResInvoice getOne(UUID id) {
        return mapperUtil.toResInvoice(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", id)));
    }

    public List<ResInvoice> getByType(String type) {
        List<ResInvoice> list = new ArrayList<>();
        List<InvoiceEntity> entities = repository.getAllInvoices(type.equals("in") ? List.of(1, 2, 3) : List.of(4, 5));
        for (InvoiceEntity invoice : entities) {
            list.add(getResInvoice(invoice));
        }

        return list;
    }

    public ResInvoice getResInvoice(InvoiceEntity entity) {
        ResInvoice res = mapperUtil.toResInvoice(entity);
        if (entity.getType() == 1 || entity.getType() == 2 || entity.getType() == 3) {
            ExpenseEntity expense = expenseRepository.findTopByInvoiceInId(res.getId()).orElse(null);//.ifPresent(expense -> res.setName(expense.getName()));
            res.setInvoiceDate(entity.getCreatedAt());
            ShippingEntity shipping = entity.getType() != 3 ? entity.getShipping() : entity.getCargo().getShipping();
            if (shipping != null) {
                res.setShipNum(shipping.getNum());
                res.setTransportNum(shipping.getShippingNum());
                if (shipping.getCarrierId() != null) {
                    CarrierEntity carrier = carrierRepository.findById(entity.getCarrierId())
                            .orElseThrow(() -> new ResourceNotFoundException("Carrier", "carrierId", entity.getCarrierId()));
                    res.setCarrierName(carrier.getName());
                }
            }
            res.setName(expense != null ? expense.getName() : "Трансортная услуга (рейс)");
        } else {
            ExpenseEntity expense = expenseRepository.findTopByInvoiceOutId(res.getId()).orElse(new ExpenseEntity());

            CargoEntity cargo = entity.getCargo();

            ClientEntity client = clientRepository.findById(entity.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Invoice", "clientId", entity.getClientId()));
            res.setClientName(client.getName());
            res.setName(entity.getType() == 4 ? expense.getName() : "Ставка за груз");

            ShippingEntity shipping = cargo.getShipping();
            if (shipping != null) {
                res.setShipNum(shipping.getNum());
                res.setTransportNum(shipping.getShippingNum());
            }
            res.setInvoiceDate(entity.getCreatedAt());
            /*if (shipping.getCarrierId() != null) {
                CarrierEntity carrier = carrierRepository.findById(shipping.getCarrierId())
                        .orElseThrow(() -> new ResourceNotFoundException("Carrier", "carrierId", shipping.getCarrierId()));
                res.setCarrierName(carrier.getName());
            }*/
        }

        return res;
    }

    public HttpEntity<?> delete(UUID id) {
        ExpenseEntity expense = expenseRepository.findTopByInvoiceInId(id).orElse(null);
        if (expense != null) {
            expense.setInvoiceInId(null);
            expenseRepository.saveAndFlush(expense);
        }
        expense = expenseRepository.findTopByInvoiceOutId(id).orElse(null);
        if (expense != null) {
            expense.setInvoiceOutId(null);
            expenseRepository.saveAndFlush(expense);
        }

        repository.deleteById(id);

        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public List<ResInvoice> getByClientIdAndType(String type, UUID clientId) {
        List<ResInvoice> list = new ArrayList<>();
        List<InvoiceEntity> entities = type.equals("in")
                ? repository.findAllByCarrierIdAndType(clientId, List.of(1, 2, 3))
                : repository.findAllByClientIdAndType(clientId, List.of(4, 5));
        for (InvoiceEntity invoice : entities) {
            list.add(getResInvoice(invoice));
        }

        return list;
    }

    public List<ResInvoice> getByClientIdAndTypeAndCurrency(String type, UUID clientId, Long currencyId) {
        List<ResInvoice> list = new ArrayList<>();
        List<InvoiceEntity> entities = type.equals("in")
                ? repository.findAllByCarrierIdAndTypeAndCurrency(clientId, List.of(1, 2, 3), currencyId)
                : repository.findAllByClientIdAndTypeAndCurrency(clientId, List.of(4, 5), currencyId);
        for (InvoiceEntity invoice : entities) {
            list.add(getResInvoice(invoice));
        }

        return list;
    }


}
