package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
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
import java.util.Date;
import java.util.List;
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
    public HttpEntity<?> getList(@RequestBody ReqOrderSearch req) {
        return service.getOrderList(req);
    }

    @GetMapping("/select")
    public HttpEntity<?> getForSelect() {
        List<OrderSelectDto> result = service.getOrdersForSelect(null);

        return ResponseEntity.status(HttpStatus.OK).body(new ResPageable(result, 0, 0));
    }

    @GetMapping("/growth-report")
    public HttpEntity<?> getClientCountByCreatedAt(@RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy") Date begin,
                                                   @RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy") Date end) {
        return ResponseEntity.ok(service.getClientCountByCreatedAt(begin, end));
    }

    @PostMapping("/report")
    public void getList(HttpServletResponse response, @RequestBody ReqOrderSearch req) {
         service.getExcelFile(response, req);
    }

}
