package uz.smart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.BalancesEntity;

import java.util.List;
import java.util.UUID;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/
@Data @NoArgsConstructor @AllArgsConstructor
public class BalancesDto {
    private UUID ownerId;
    private String ownerName;
    List<BalancesEntity> balancesList;
}
