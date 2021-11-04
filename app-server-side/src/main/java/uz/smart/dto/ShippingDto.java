package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ShippingDto {
    private UUID id;
    private String num;
    private UUID managerId;
    private UUID carrierId;
    private long currencyId;
    private BigDecimal price;
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private long shippingTypeId;
    private String shippingNum;
    private UUID orderId;
}
