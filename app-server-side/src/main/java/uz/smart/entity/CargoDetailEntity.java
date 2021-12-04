package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import java.math.BigDecimal;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "cargo_detail")
public class CargoDetailEntity extends BaseEntity implements Comparable<CargoDetailEntity> {

    private BigDecimal weight;
    private BigDecimal capacity;
    private BigDecimal packageAmount;
    private Long packageTypeId;
    private String packageTypeName;

    @Override
    public int compareTo(CargoDetailEntity other) {
        return this.getCreatedAt().compareTo(other.getCreatedAt());
    }
}
