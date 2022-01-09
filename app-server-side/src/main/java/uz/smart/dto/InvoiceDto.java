package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class InvoiceDto {
    private UUID id;
    private Long currencyId;
    private String currencyName;
    private BigDecimal price;
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private String comment;
    private int type;

    private UUID expenseId;
    private UUID shippingId;
    private UUID orderId;
}
