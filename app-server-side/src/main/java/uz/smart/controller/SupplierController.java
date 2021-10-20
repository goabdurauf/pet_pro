package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.SupplierDto;
import uz.smart.service.SupplierService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/supplier")
public class SupplierController {

    @Autowired
    SupplierService service;

    @PostMapping("/save")
    public HttpEntity<?> save(@RequestBody SupplierDto dto) {
        return service.saveAndUpdate(dto);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return service.deleteSupplier(id);
    }

    @GetMapping("/{id}")
    public SupplierDto get(@PathVariable UUID id) {
        return service.getSupplier(id);
    }

    @GetMapping("/list")
    public List<SupplierDto> getList() {
        return service.getSupplierList();
    }
}
