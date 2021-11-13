package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.CargoDto;
import uz.smart.payload.ResCargo;
import uz.smart.service.CargoService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cargo")
public class CargoController {

    @Autowired
    CargoService service;

    @PostMapping("/save")
    public HttpEntity<?> save(@RequestBody CargoDto dto) { return service.saveAndUpdate(dto); }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) { return service.deleteCargo(id); }

    @GetMapping("/{id}")
    public CargoDto get(@PathVariable UUID id) { return service.getCargo(id); }

    @GetMapping("/list")
    public List<ResCargo> getList() { return service.getCargoList(); }

    @GetMapping("/order/{id}")
    public List<ResCargo> getListByOrder(@PathVariable UUID id) { return service.getCargoListByOrderId(id); }

}
