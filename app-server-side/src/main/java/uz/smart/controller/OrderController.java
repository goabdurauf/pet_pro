package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.OrderDto;
import uz.smart.dto.OrderSelectDto;
import uz.smart.payload.ReqOrderSearch;
import uz.smart.payload.ResOrder;
import uz.smart.payload.ResPageable;
import uz.smart.service.OrderService;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

@Slf4j
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
    public HttpEntity<?> getList(@RequestBody ReqOrderSearch req) {
        return service.getOrderList(req);
    }

    @GetMapping("/select")
    public HttpEntity<?> getForSelect() {
        List<OrderSelectDto> result = service.getOrdersForSelect(null);

        return ResponseEntity.status(HttpStatus.OK).body(new ResPageable(result, 0, 0));
    }

    @GetMapping("/report")
    public void getOrderReport(@RequestBody ReqOrderSearch req, HttpServletResponse response) {
        service.getExcelFile(response, req);
    }
}
