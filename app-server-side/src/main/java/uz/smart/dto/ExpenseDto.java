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
    private Long nameId;
    private UUID carrierId;
    private String carrierName;
    private UUID ownerId;
    private UUID oldId;
    private String oldNum;
    private String ownerName;
    private String ownerNum;
    private ExpenseType type;
    private UUID invoiceInId;
    private UUID invoiceOutId;

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

    public ExpenseDto(UUID id, ExpenseType type, UUID invoiceInId, UUID invoiceOutId, String toCurrencyName, BigDecimal toPrice) {
        this.id = id;
        this.toCurrencyName = toCurrencyName;
        this.toPrice = toPrice;
        this.invoiceInId = invoiceInId;
        this.invoiceOutId = invoiceOutId;
        this.type = type;
    }

    public ExpenseDto(UUID id, ExpenseType type, UUID invoiceInId, UUID invoiceOutId, String fromCurrencyName, BigDecimal fromPrice, String toCurrencyName, BigDecimal toPrice) {
        this.id = id;
        this.type = type;
        this.invoiceInId = invoiceInId;
        this.invoiceOutId = invoiceOutId;
        this.fromCurrencyName = fromCurrencyName;
        this.fromPrice = fromPrice;
        this.toCurrencyName = toCurrencyName;
        this.toPrice = toPrice;
    }
}
