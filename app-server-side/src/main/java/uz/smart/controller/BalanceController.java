package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uz.smart.dto.BalancesForBar;
import uz.smart.dto.BalancesTotalDto;
import uz.smart.service.BalancesService;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/balances")
public class BalanceController {

    @Autowired
    BalancesService service;

    @GetMapping("/client")
    public BalancesTotalDto getClientBalances() { return service.getClientBalances(); }

    @GetMapping("/carrier")
    public BalancesTotalDto getCarrierBalances() { return service.getCarrierBalances(); }

    @GetMapping("/bar/date")
    public List<BalancesForBar> getBalanceByDate(
            @RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy") Date date
    ) {return service.getBalanceByDate(date);}

    @GetMapping("/client/verification")
    public HttpEntity<?> getClientVer() {
        return ResponseEntity.ok(service.getClientVerActs());
    }

    @GetMapping("/carrier/verification")
    public HttpEntity<?> getCarrierVer() {
        return ResponseEntity.ok(service.getCarrierVerActs());
    }

    @GetMapping("/shipping/income")
    public HttpEntity<?> getIncomeByShipping() {
        return ResponseEntity.ok(service.getShippingIncomeList());
    }


}
