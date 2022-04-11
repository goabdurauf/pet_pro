package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 09.04.2022. 
*/


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class BalancesTotalDto {
    private List<BalancesDto> agents = new ArrayList<>();
    private List<BalancesCurrencyDto> currencies = new ArrayList<>();
}
