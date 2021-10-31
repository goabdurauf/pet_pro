package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021.
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.CarrierDto;
import uz.smart.service.CarrierService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/carrier")
public class CarrierController {

    @Autowired
    CarrierService service;

    @PostMapping("/save")
    public HttpEntity<?> save(@RequestBody CarrierDto dto) {
        return service.saveAndUpdateCarrier(dto);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return service.deleteCarrier(id);
    }

    @GetMapping("/{id}")
    public CarrierDto get(@PathVariable UUID id) {
        return service.getCarrier(id);
    }

    @GetMapping("/list")
    public List<CarrierDto> getList() {
        return service.getCarrierList();
    }
}
