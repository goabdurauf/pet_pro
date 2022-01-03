package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 02.01.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.KassaDto;
import uz.smart.service.KassaService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/kassa")
public class KassaController {

    @Autowired
    KassaService service;

    @PostMapping("/save")
    public HttpEntity<?> saveInvoice(@RequestBody KassaDto dto) {
        return service.saveAndUpdate(dto);
    }

    @GetMapping("/{id}")
    public KassaDto getOne(@PathVariable UUID id) {
        return service.getById(id);
    }

    @GetMapping("/list")
    public List<KassaDto> getList() {
        return service.getKassaList();
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return service.delete(id);
    }
}
