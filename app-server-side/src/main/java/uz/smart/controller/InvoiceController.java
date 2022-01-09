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

    @GetMapping("/{id}")
    public ResInvoice getOne(@PathVariable UUID id) {
        return service.getOne(id);
    }

    @GetMapping("/list/{type}")
    public List<ResInvoice> getList(@PathVariable String type) {
        return service.getByType(type);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return service.delete(id);
    }
}
