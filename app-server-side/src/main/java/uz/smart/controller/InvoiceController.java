package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.InvoiceDto;
import uz.smart.payload.ResInvoice;
import uz.smart.service.InvoiceService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoice")
public class InvoiceController {

    @Autowired
    InvoiceService service;

    @PostMapping("/save")
    public HttpEntity<?> saveInvoice(@RequestBody InvoiceDto dto) {
        return service.saveInvoice(dto);
    }

    @PutMapping("/update")
    public HttpEntity<?> updateInvoice(@RequestBody InvoiceDto dto) {
        return service.updateInvoice(dto);
    }

    @GetMapping("/{id}")
    public ResInvoice getOne(@PathVariable UUID id) {
        return service.getOne(id);
    }

    @GetMapping("/list/{type}")
    public List<ResInvoice> getList(@PathVariable String type) {
        return service.getByType(type);
    }

    @GetMapping("/{type}/{clientId}")
    public List<ResInvoice> getListByClientId(@PathVariable String type, @PathVariable UUID clientId) {
        return service.getByClientIdAndType(type, clientId);
    }

    @GetMapping("/{type}/{clientId}/{currencyId}")
    public List<ResInvoice> getListByClientId(@PathVariable String type, @PathVariable UUID clientId, @PathVariable Long currencyId) {
        return service.getByClientIdAndTypeAndCurrency(type, clientId, currencyId);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return service.delete(id);
    }
}
