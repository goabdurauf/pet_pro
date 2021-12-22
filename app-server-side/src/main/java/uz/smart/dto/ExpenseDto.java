package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 12.12.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.enums.ExpenseType;
import uz.smart.payload.ResDividedExpense;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ExpenseDto {
    private UUID id;
    private String name;
    private UUID carrierId;
    private String carrierName;
    private UUID ownerId;
    private UUID oldId;
    private String oldNum;
    private String ownerName;
    private String ownerNum;
    private ExpenseType type;

    private List<ResDividedExpense> dividedExpenseList = new ArrayList<>();

    private Long fromCurrencyId;
    private String fromCurrencyName;
    private BigDecimal fromPrice;
    private BigDecimal fromRate;
    private BigDecimal fromFinalPrice;

    private Long toCurrencyId;
    private String toCurrencyName;
    private BigDecimal toPrice;
    private BigDecimal toRate;
    private BigDecimal toFinalPrice;

    private String comment;
}
