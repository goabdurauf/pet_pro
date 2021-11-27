package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 26.11.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor @AllArgsConstructor @Data
public class CargoStatusDto {
    @NotNull
    private Long statusId;
    @NotNull
    private List<UUID> cargoIdList;
}
