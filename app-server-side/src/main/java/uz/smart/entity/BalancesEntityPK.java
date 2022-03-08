package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class BalancesEntityPK implements Serializable {
    private UUID ownerId;
    private Long currencyId;
}
