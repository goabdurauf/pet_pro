package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.smart.dto.BalancesDto;
import uz.smart.service.BalancesService;

import java.util.List;

@RestController
@RequestMapping("/api/balances")
public class BalanceController {

    @Autowired
    BalancesService service;

    @GetMapping("/client")
    public List<BalancesDto> getClientBalances() { return service.getClientBalances(); }

    @GetMapping("/carrier")
    public List<BalancesDto> getCarrierBalances() { return service.getCarrierBalances(); }

}
