package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 12.12.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.smart.entity.enums.ExpenseType;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "expenses")
public class ExpenseEntity extends BaseEntity {
  private String name;
  @ManyToOne
  private CarrierEntity carrier;

  private UUID ownerId;    // type = 0  -> CargoEntity, type = 1  -> ShippingEntity
  private UUID oldId;
  private String oldNum;
  private ExpenseType type;

  private UUID invoiceInId;
  private UUID invoiceOutId;

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
