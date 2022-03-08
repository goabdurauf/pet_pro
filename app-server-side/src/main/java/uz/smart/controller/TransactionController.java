package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 16.01.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.TransactionsDto;
import uz.smart.payload.ApiResponse;
import uz.smart.service.TransactionService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transaction")
public class TransactionController {

    @Autowired
    TransactionService service;

    @PostMapping("/in/save")
    public HttpEntity<?> saveIn(@RequestBody TransactionsDto dto) {
        return service.saveInTransaction(dto);
    }

    @PutMapping("/in/update")
    public HttpEntity<?> updateIn(@RequestBody TransactionsDto dto) {
        return service.updateInTransaction(dto);
    }

    @PostMapping("/out/save")
    public HttpEntity<?> saveOut(@RequestBody TransactionsDto dto) {
        return service.saveOutTransaction(dto);
    }

    @PutMapping("/out/update")
    public HttpEntity<?> updateOut(@RequestBody TransactionsDto dto) {
        return service.updateOutTransaction(dto);
    }

    @GetMapping("/{id}")
    public TransactionsDto getOne(@PathVariable UUID id) {
        return service.getById(id);
    }

    @GetMapping("/list")
    public List<TransactionsDto> getList() {
        return service.getTransactionList();
    }

    @GetMapping("/num")
    public ApiResponse getNextNum() { return new ApiResponse(service.getNextNum(), true); }

}
