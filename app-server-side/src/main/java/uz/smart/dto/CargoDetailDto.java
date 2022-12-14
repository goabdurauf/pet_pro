package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class CargoDetailDto {
    private UUID id;
    private BigDecimal weight;
    private BigDecimal capacity;
    private BigDecimal packageAmount;
    private Long packageTypeId;
    private String packageTypeName;

    @Override
    public String toString() {
        return
            "Вес: " + weight + "\n" +
            "Объём: " + capacity + "\n" +
            "Кол-во уп.: " + packageAmount + "\n";
    }
}
