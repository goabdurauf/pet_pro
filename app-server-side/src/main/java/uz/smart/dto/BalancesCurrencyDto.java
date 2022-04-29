package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 09.04.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
public class BalancesCurrencyDto {
    private Long id;
    private String currencyName;
    private BigDecimal balance = BigDecimal.ZERO;
}
