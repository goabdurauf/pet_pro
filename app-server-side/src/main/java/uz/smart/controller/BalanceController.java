package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.smart.dto.BalancesTotalDto;
import uz.smart.service.BalancesService;

@RestController
@RequestMapping("/api/balances")
public class BalanceController {

    @Autowired
    BalancesService service;

    @GetMapping("/client")
    public BalancesTotalDto getClientBalances() { return service.getClientBalances(); }

    @GetMapping("/carrier")
    public BalancesTotalDto getCarrierBalances() { return service.getCarrierBalances(); }

}
