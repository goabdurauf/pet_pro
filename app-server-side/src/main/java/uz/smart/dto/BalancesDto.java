package uz.smart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/
@Data @NoArgsConstructor @AllArgsConstructor
public class BalancesDto {
    private String id;
    private String ownerName;
    private String currencyName;
    private BigDecimal balance;
}
