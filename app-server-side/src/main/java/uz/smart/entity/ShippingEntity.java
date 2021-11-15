package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 22.10.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "shipping")
public class ShippingEntity extends BaseEntity {
    private String num;
    private UUID managerId;
    private UUID carrierId;
    private long currencyId;
    private String currencyName;
    private BigDecimal price;
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private long shippingTypeId;
    private String shippingTypeName;
    private String shippingNum;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "shipping_order", joinColumns = {@JoinColumn(name = "shipping_id")},
            inverseJoinColumns = {@JoinColumn(name = "order_id")})
    private List<OrderEntity> orderEntities;

    @OneToMany(fetch = FetchType.LAZY)
    private List<CargoEntity> cargoEntities;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> attachments;
}
