package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.DocumentDto;
import uz.smart.dto.ExpenseDto;
import uz.smart.dto.ShippingDto;
import uz.smart.payload.ResShipping;
import uz.smart.service.ShippingService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/shipping")
public class ShippingController {

    @Autowired
    ShippingService service;

    @PostMapping("/save")
    public HttpEntity<?> save(@RequestBody ShippingDto dto) {
        return service.saveAndUpdateShipping(dto);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return service.deleteShipping(id);
    }

    @GetMapping("/{id}")
    public ShippingDto get(@PathVariable UUID id) {
        return service.getShipping(id);
    }

    @GetMapping("/list")
    public List<ResShipping> getList() {return service.getShippingList();}

    @GetMapping("/order/{id}")
    public List<ResShipping> getListByOrderId(@PathVariable UUID id) {return service.getShippingListByOrderId(id);}

    @GetMapping("/detail/{id}")
    public ResShipping getResShippingById(@PathVariable UUID id) {return service.getResShipping(id);}

    @DeleteMapping("/{shippingId}/cargo/{cargoId}")
    public HttpEntity<?> deleteCargoFromShippingById(
            @PathVariable UUID shippingId, @PathVariable UUID cargoId
    ) {return service.removeCargoById(shippingId, cargoId);}

    @PostMapping("/document")
    public List<DocumentDto> addDocument(@RequestBody DocumentDto dto) {
        return service.addDocument(dto);
    }

    @DeleteMapping("/{shippingId}/document/{docId}")
    public List<DocumentDto> deleteDocumentFromShippingById(
            @PathVariable UUID shippingId, @PathVariable UUID docId
    ) {return service.removeDocumentById(shippingId, docId);}

    @PostMapping("/expense")
    public List<ExpenseDto> addExpense(@RequestBody ExpenseDto dto){ return service.addExpense(dto);}

    @GetMapping("/expense/{shippingId}")
    public List<ExpenseDto> getExpenseList(@PathVariable UUID shippingId) {return service.getExpensesByShippingId(shippingId);}

    @DeleteMapping("/expense/{id}")
    public HttpEntity<?> deleteExpense(@PathVariable UUID id) {
        return service.deleteExpenseFromShipping(id);
    }
}
