package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 16.01.2022.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class TransactionsInvoicesDto {

    private UUID invoiceId;
    private BigDecimal credit;
    private BigDecimal debit = BigDecimal.ZERO;

    public TransactionsInvoicesDto(UUID invoiceId, BigDecimal credit) {
        this.invoiceId = invoiceId;
        this.credit = credit;
    }
}
