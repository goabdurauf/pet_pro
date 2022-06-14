package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.InvoiceDto;
import uz.smart.payload.ReqInvoiceSearch;
import uz.smart.payload.ResInvoice;
import uz.smart.service.InvoiceService;

import javax.servlet.http.HttpServletResponse;
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

    @PostMapping("/list/{type}")
    public HttpEntity<?> getList(@PathVariable String type, @RequestBody ReqInvoiceSearch req) {
        return service.getByType(type, req);
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

    @PostMapping("/report/{type}")
    public void getExcelFile(HttpServletResponse response, @PathVariable String type, @RequestBody ReqInvoiceSearch req) {
         service.getExcelFile(response ,type, req);
    }
}
