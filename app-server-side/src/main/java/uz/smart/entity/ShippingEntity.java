package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 22.10.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.enums.ShippingStatus;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "shipping")
public class ShippingEntity extends BaseEntity {
    private String num;
    private String shippingNum;
    private UUID managerId;
    private UUID carrierId;
    private long currencyId;
    private String currencyName;
    private BigDecimal price;
    @Column(precision = 19, scale = 4)
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private long shippingTypeId;
    private String comment;

    private Long transportKindId;
    private String transportKindName;
    private Long transportConditionId;
    private String transportConditionName;

    private ShippingStatus status;

    private Timestamp loadDate;
    private String loadStation;
    private Timestamp loadSendDate;

    private Timestamp customArrivalDate;
    private String customStation;
    private Timestamp customSendDate;

    private Timestamp unloadArrivalDate;
    private String unloadStation;
    private Timestamp unloadDate;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "shipping_order", joinColumns = {@JoinColumn(name = "shipping_id")},
            inverseJoinColumns = {@JoinColumn(name = "order_id")})
    private List<OrderEntity> orderEntities;

    @OneToMany(fetch = FetchType.LAZY)
    private List<CargoEntity> cargoEntities;

    @OneToMany(fetch = FetchType.LAZY)
    private List<DocumentEntity> documents;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<ExpenseEntity> expenseList;
}
