package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 02.01.2022.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class KassaDto {
    private UUID id;
    private String name;
    private Long currencyId;
    private String currencyName;
    private BigDecimal balans;
}
