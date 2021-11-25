package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.CargoDto;
import uz.smart.dto.DocumentDto;
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

    @PostMapping("/clone")
    public HttpEntity<?> clone(@RequestBody CargoDto dto) { return service.cloneCargo(dto); }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) { return service.deleteCargo(id); }

    @GetMapping("/{id}")
    public CargoDto get(@PathVariable UUID id) { return service.getCargo(id); }

    @GetMapping("/list")
    public List<ResCargo> getList() { return service.getCargoList(); }

    @GetMapping("/order/{id}")
    public List<ResCargo> getListByOrder(@PathVariable UUID id) { return service.getCargoListByOrderId(id); }

    @GetMapping("/document/{orderId}")
    public List<DocumentDto> getDocumentListByOrder(@PathVariable UUID orderId) { return service.getCargoDocumentsByOrderId(orderId); }

    @DeleteMapping("/{orderId}/document/{docId}")
    public List<DocumentDto> deleteDocumentFromCargo(@PathVariable UUID orderId, @PathVariable UUID docId){
        return service.removeDocumentByOrderId(orderId, docId);
    }

}
