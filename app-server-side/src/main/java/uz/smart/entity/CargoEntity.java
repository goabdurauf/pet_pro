package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "cargo")
public class CargoEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    private ShippingEntity shipping;

    @ManyToOne(fetch = FetchType.LAZY)
    private ProductEntity product;

    private String name;
    private String num;
    private Timestamp loadDate;
    private Timestamp unloadDate;
    private String comment;
    private Long statusId;
    private String statusName;
    private Long regTypeId;
    private String regTypeName;
    private UUID invoiceOutId;

    private Long transportKindId;
    private String transportKindName;
    private Long transportConditionId;
    private String transportConditionName;

    private Long currencyId;
    private String currencyName;
    private BigDecimal price;
    @Column(precision = 19, scale = 4)
    private BigDecimal rate;
    private BigDecimal finalPrice;

    @OneToMany(fetch = FetchType.LAZY)
    private List<CargoDetailEntity> cargoDetails;

    private String senderName;
    private Long senderCountryId;
    private String senderCountryName;
    private String senderCity;
    private String senderOthers;

    @OneToMany(fetch = FetchType.LAZY)
    private List<DocumentEntity> documentList;

    @OneToMany(fetch = FetchType.LAZY)
    private Set<ExpenseEntity> expenseList;

    private String receiverName;
    private Long receiverCountryId;
    private String receiverCountryName;
    private String receiverCity;
    private String receiverOthers;

    private String customFromName;
    private Long customFromCountryId;
    private String customFromCountryName;
    private String customFromCity;
    private String customFromOthers;

    private String customToName;
    private Long customToCountryId;
    private String customToCountryName;
    private String customToCity;
    private String customToOthers;

/*
    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> customFromAttachments;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> receiverAttachments;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> customToAttachments;
*/

}
