package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 16.12.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResShippingDivide {
    private UUID id;
    private Integer typeId;
    private BigDecimal expensePrice = BigDecimal.ZERO;
    private BigDecimal totalWeight = BigDecimal.ZERO;
    private BigDecimal totalCapacity = BigDecimal.ZERO;
    private List<ResDivide> divideList = new ArrayList<>();
}
