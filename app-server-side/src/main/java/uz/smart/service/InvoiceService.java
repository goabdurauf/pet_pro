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
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ResInvoice;
import uz.smart.repository.*;

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
    MapperUtil mapperUtil;

    public HttpEntity<?> saveInvoice(InvoiceDto dto) {
        InvoiceEntity entity = dto.getId() == null
                ? mapperUtil.toInvoiceEntity(dto, new InvoiceEntity())
                : mapperUtil.toInvoiceEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dto.getId())));
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
        }
        entity = repository.saveAndFlush(entity);
        if (dto.getExpenseId() != null) {
            ExpenseEntity expense = expenseRepository.findById(dto.getExpenseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", dto.getExpenseId()));

            expense.setInvoiceId(entity.getId());
            expenseRepository.saveAndFlush(expense);
        }

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public ResInvoice getOne(UUID id) {
        return mapperUtil.toResInvoice(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", id)));
    }

    public List<ResInvoice> getAll() {
        List<ResInvoice> list = new ArrayList<>();
        List<InvoiceEntity> entities = repository.getAllInvoices();
        for (InvoiceEntity invoice : entities) {
            list.add(getResInvoice(invoice));
        }

        return list;
    }

    public ResInvoice getResInvoice(InvoiceEntity entity) {
        ResInvoice res = mapperUtil.toResInvoice(entity);
        ShippingEntity shipping = entity.getShipping();
        res.setShipNum(shipping.getNum());
        res.setTransportNum(shipping.getShippingNum());
        res.setInvoiceDate(entity.getCreatedAt());
        if (shipping.getCarrierId() != null) {
            CarrierEntity carrier = carrierRepository.findById(entity.getCarrierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Carrier", "carrierId", entity.getCarrierId()));
            res.setCarrierName(carrier.getName());
        }

        expenseRepository.findTopByInvoiceId(res.getId()).ifPresent(expense -> res.setName(expense.getName()));

        return res;
    }

    public HttpEntity<?> delete(UUID id) {
        ExpenseEntity expense = expenseRepository.findTopByInvoiceId(id).orElse(null);
        if (expense != null) {
            expense.setInvoiceId(null);
            expenseRepository.saveAndFlush(expense);
        }
        repository.deleteById(id);

        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }
}
