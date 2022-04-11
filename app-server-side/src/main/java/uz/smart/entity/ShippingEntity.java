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
    private UUID invoiceInId;

    private Long transportKindId;
    private String transportKindName;
    private Long transportConditionId;
    private String transportConditionName;

    private ShippingStatus status;

    private Timestamp loadDate;
    private Long loadStationId;
    private String loadStation;
    private Timestamp loadSendDate;

    private Timestamp customArrivalDate;
    private Long customStationId;
    private String customStation;
    private Timestamp customSendDate;

    private Timestamp unloadArrivalDate;
    private Long unloadStationId;
    private String unloadStation;
    private Timestamp unloadDate;

    private Long factoryAddressId;
//    private Long departureStationId;
//    private Long arrivalStationId;
    private Long chaseStatusId;
    private String cargoName;
    private String kazahNumber;
    private String currentLocation;
    private String trackingComment;
    private Long durationDays;
    private Timestamp docPassDate;
//    private Timestamp shippingDepartureDate;
//    private Timestamp transitArrivalDate;
//    private Timestamp transitDepartureDate;
    private Timestamp containerReturnDate;

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
