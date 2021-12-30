package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "invoices")
public class InvoiceEntity extends BaseEntity {

    private Long currencyId;
    private String currencyName;
    private BigDecimal price;
    @Column(precision = 19, scale = 4)
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private String comment;
    private UUID carrierId;

    @ManyToOne(fetch = FetchType.LAZY)
    private ShippingEntity shipping;

}
