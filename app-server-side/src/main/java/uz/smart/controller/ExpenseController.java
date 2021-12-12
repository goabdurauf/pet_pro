package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 12.12.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.smart.dto.ExpenseDto;
import uz.smart.service.ExpenseService;

import java.util.UUID;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {

    @Autowired
    ExpenseService service;

    @GetMapping("/{id}")
    public ExpenseDto get(@PathVariable UUID id) { return service.getExpenseDto(id); }

}
