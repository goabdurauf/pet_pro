package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 12.04.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
public class BalancesForBar {
    private String currency;
    private BigDecimal client = BigDecimal.ZERO;
    private BigDecimal carrier = BigDecimal.ZERO;
    private BigDecimal amount = BigDecimal.ZERO;
}
