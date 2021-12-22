package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 12.12.2021. 
*/

import lombok.*;
import uz.smart.entity.enums.ExpenseType;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;
import java.util.UUID;

@NoArgsConstructor @AllArgsConstructor
@Getter @Setter
@Entity(name = "expenses")
public class ExpenseEntity extends BaseEntity {
    private String name;
    @ManyToOne
    private CarrierEntity carrier;
    
    private UUID ownerId;
    private UUID oldId;
    private String oldNum;
    private ExpenseType type;

    private Long fromCurrencyId;
    private String fromCurrencyName;
    private BigDecimal fromPrice;
    @Column(precision = 19, scale = 4)
    private BigDecimal fromRate;
    private BigDecimal fromFinalPrice;

    private Long toCurrencyId;
    private String toCurrencyName;
    private BigDecimal toPrice;
    @Column(precision = 19, scale = 4)
    private BigDecimal toRate;
    private BigDecimal toFinalPrice;

    private String comment;
}
