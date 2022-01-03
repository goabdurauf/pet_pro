package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 02.01.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "kassalar")
public class KassaEntity extends BaseEntity {
    private String name;
    private Long currencyId;
    private String currencyName;

    @Column(precision = 19, scale = 4)
    private BigDecimal balance = BigDecimal.ZERO;

}
