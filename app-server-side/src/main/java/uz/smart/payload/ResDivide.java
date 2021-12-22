package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 16.12.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResDivide {
    private UUID id;
    private UUID ownerId;
    private String shippingNum;
    private String orderNum;
    private String clientName;
    private String cargoName;
    private BigDecimal weight = BigDecimal.ZERO;
    private BigDecimal capacity = BigDecimal.ZERO;
    private BigDecimal packageAmount = BigDecimal.ZERO;
    private BigDecimal finalPrice = BigDecimal.ZERO;
}
