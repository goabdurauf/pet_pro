package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 20.12.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResDividedExpense {
    private UUID id;
    private String cargoName;
    private String cargoNum;
    private BigDecimal finalPrice;
}
