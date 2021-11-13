package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.OrderDto;
import uz.smart.payload.ReqSearch;
import uz.smart.payload.ResOrder;
import uz.smart.service.OrderService;

import java.util.UUID;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    OrderService service;

    @PostMapping("/save")
    public HttpEntity<?> save(@RequestBody OrderDto dto) {
        return service.saveAndUpdate(dto);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return service.deleteOrder(id);
    }

    @GetMapping("/{id}")
    public ResOrder get(@PathVariable UUID id) {return service.getOrder(id, false);}

    @GetMapping("/detail/{id}")
    public ResOrder getDetail(@PathVariable UUID id) {return service.getOrder(id, true);}

    @PostMapping("/list")
    public HttpEntity<?> getList(@RequestBody ReqSearch req) {
        return service.getOrderList(req);
    }

    @GetMapping("/select")
    public HttpEntity<?> getForSelect() {
        return service.getOrdersForSelect();
    }
}
