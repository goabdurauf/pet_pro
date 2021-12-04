package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "cargo")
public class CargoEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    private OrderEntity order;

    @ManyToOne(fetch = FetchType.LAZY)
    private ShippingEntity shipping;

    private String name;
    private String num;
    private String code;
    private Timestamp loadDate;
    private Timestamp unloadDate;
    private String comment;
    private Long statusId;
    private String statusName;

    @OneToMany(fetch = FetchType.LAZY)
    private List<CargoDetailEntity> cargoDetails;

    private String senderName;
    private Long senderCountryId;
    private String senderCountryName;
    private String senderCity;
    private String senderOthers;

    @OneToMany(fetch = FetchType.LAZY)
    private List<DocumentEntity> documentList;

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
