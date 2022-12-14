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
import uz.smart.entity.enums.VerificationType;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.*;
import uz.smart.repository.*;
import uz.smart.utils.AppConstants;

import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

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
    VerificationActRepository verificationActRepository;
    @Autowired
    MapperUtil mapperUtil;
    @Autowired
    ReportService reportService;

    private final SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");

    public HttpEntity<?> saveInvoice(InvoiceDto dto) {
        InvoiceEntity entity = dto.getId() == null
                ? mapperUtil.toInvoiceEntity(dto, new InvoiceEntity())
                : mapperUtil.toInvoiceEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dto.getId())));
        entity.setBalance(BigDecimal.ZERO.subtract(entity.getPrice()));
        InvoiceEntity last = repository.getFirstByOrderByUpdatedAtDesc().orElse(null);
        entity.setNum(last != null && last.getNum() != null ? (last.getNum() + 1) : 1);
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

        boolean invoiceIn = List.of(1, 2, 3).contains(entity.getType());
        BalancesEntity bEntity = invoiceIn
            ? balancesRepository.findById(new BalancesEntityPK(entity.getCarrierId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(entity.getCarrierId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier))
            : balancesRepository.findById(new BalancesEntityPK(entity.getClientId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(entity.getClientId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));

        bEntity.setBalance(bEntity.getBalance().add(entity.getPrice()));
        balancesRepository.save(bEntity);

        verificationActRepository.saveAndFlush(
                new VerificationActEntity(
                        invoiceIn ? VerificationType.InvoiceIn : VerificationType.InvoiceOut,
                        entity.getId(),
                        invoiceIn ? entity.getCarrierId() : entity.getClientId(),
                        entity.getCurrencyId(),
                        entity.getCreatedAt()
                ));

        return ResponseEntity.ok().body(new ApiResponse("?????????????????? ??????????????", true));
    }

    public HttpEntity<?> updateInvoice(InvoiceDto dto) {
        InvoiceEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dto.getId()));
        if (dto.getCurrencyId() != null) {
            ListEntity currency = listRepository.findById(dto.getCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
            entity.setCurrencyName(currency.getNameRu());
        }
        if (entity.getNum() == null) {
            InvoiceEntity last = repository.getFirstByOrderByUpdatedAtDesc().orElse(null);
            entity.setNum(last != null && last.getNum() != null ? (last.getNum() + 1) : 1);
        }
        entity.setCurrencyId(dto.getCurrencyId());
        entity.setPrice(dto.getPrice());
        entity.setRate(dto.getRate());
        entity.setBalance(BigDecimal.ZERO.subtract(dto.getPrice().subtract(entity.getPrice().add(entity.getBalance()))));
        entity.setFinalPrice(dto.getFinalPrice());
        entity.setComment(dto.getComment());
        repository.save(entity);

        boolean invoiceIn = List.of(1, 2, 3).contains(entity.getType());
        VerificationActEntity verAct = verificationActRepository.findByDocId(entity.getId()).orElse(new VerificationActEntity());
        verAct.setType(invoiceIn ? VerificationType.InvoiceIn : VerificationType.InvoiceOut);
        verAct.setDocId(entity.getId());
        verAct.setOwnerId(invoiceIn ? entity.getCarrierId() : entity.getClientId());
        verAct.setCurrencyId(entity.getCurrencyId());
        verAct.setDate(entity.getCreatedAt());
        verificationActRepository.saveAndFlush(verAct);

        return ResponseEntity.ok().body(new ApiResponse("???????????????? ??????????????", true));
    }

    public ResInvoice getOne(UUID id) {
        return mapperUtil.toResInvoice(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", id)));
    }

    public HttpEntity<?> getByType(String type, ReqInvoiceSearch req) {
        ResPageable<?> resPageable = getResPageable(type, req);
        return ResponseEntity.ok(resPageable);
    }

    public ResPageable<List<ResInvoice>> getResPageable(String type, ReqInvoiceSearch req) {
        req.setWord(req.getWord() == null ? null : req.getWord().toLowerCase());
        long totalElement = 0;
        List<ResInvoice> list = new ArrayList<>();
        Set<InvoiceEntity> entityList; // = repository.getInvoicesByTypeAndFilter(type.equals("in") ? List.of(1, 2, 3) : List.of(4, 5));
        try {
            if (type.equals("in")) {
                entityList = repository.getInvoicesInByFilter(
                        req.getWord(), req.getWord(), req.getWord(), req.getCarrierId(),
                        new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
                        new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.BEGIN_DATE).getTime()),
                        req.getPage() * req.getSize(), req.getSize(), List.of(1, 2, 3));
                totalElement = repository.getInvoicesInCount(
                        req.getWord(), req.getWord(), req.getWord(), req.getCarrierId(),
                        new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
                        new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.BEGIN_DATE).getTime()),
                        List.of(1, 2, 3));
            } else {
                entityList = repository.getInvoicesOutByFilter(
                        req.getWord(), req.getWord(), req.getWord(), req.getClientId(),
                        new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
                        new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.BEGIN_DATE).getTime()),
                        req.getPage() * req.getSize(), req.getSize(), List.of(4, 5));
                totalElement = repository.getInvoicesOutCount(
                        req.getWord(), req.getWord(), req.getWord(), req.getClientId(),
                        new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
                        new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.BEGIN_DATE).getTime()),
                        List.of(4, 5));
            }
        } catch (ParseException e) {
            e.printStackTrace();
            return new ResPageable<>(new ArrayList<>(), totalElement, req.getPage());
        }
        for (InvoiceEntity invoice : entityList) {
            list.add(getResInvoice(invoice));
        }

        return new ResPageable<>(list, totalElement, req.getPage());
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
            res.setName(expense != null ? expense.getName() : "?????????????????????? ???????????? (????????)");
        } else {
            ExpenseEntity expense = expenseRepository.findTopByInvoiceOutId(res.getId()).orElse(new ExpenseEntity());
            CargoEntity cargo = entity.getCargo();
            ClientEntity client = clientRepository.findById(entity.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Invoice", "clientId", entity.getClientId()));
            res.setClientName(client.getName());
            res.setName(entity.getType() == 4 ? expense.getName() : "???????????? ???? ????????");

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

        return ResponseEntity.ok().body(new ApiResponse("?????????????? ??????????????", true));
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

    public void getExcelFile(HttpServletResponse response, String type, ReqInvoiceSearch req) {

        String[] sheetNames = new String[1];
        String templateName = "";
        String fileName = "";
        HashMap<String, Object> params = new HashMap<>();
        List<ResInvoice> invoiceReports = getResPageable(type, req).getObject();
        if (type.equals("in")) {
            sheetNames[0] = "???????????????????? ??????????";
            templateName = "InvoiceReport.jrxml";
            fileName = "ReceivedInvoiceReport";
            params.put("isClient", false);
        }else if(type.equals("out")) {
            sheetNames[0] = "???????????????????? ??????????";
            templateName = "InvoiceReport.jrxml";
            fileName = "IssuedInvoiceReport";
            params.put("isClient", true);
        }
        reportService.getExcelFile(response, new Report<>(templateName, sheetNames, fileName, params, invoiceReports));
    }
}
