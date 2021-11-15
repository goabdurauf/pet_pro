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

    private String name;
    private String num;
    private String code;
    private Timestamp loadDate;
    private Timestamp unloadDate;
    private String comment;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private List<CargoDetailEntity> cargoDetails;

    private String senderName;
    private Long senderCountryId;
    private String senderCountryName;
    private String senderCity;
    private String senderOthers;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> senderAttachments;

    private String receiverName;
    private Long receiverCountryId;
    private String receiverCountryName;
    private String receiverCity;
    private String receiverOthers;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> receiverAttachments;

    private String customFromName;
    private Long customFromCountryId;
    private String customFromCountryName;
    private String customFromCity;
    private String customFromOthers;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> customFromAttachments;

    private String customToName;
    private Long customToCountryId;
    private String customToCountryName;
    private String customToCity;
    private String customToOthers;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> customToAttachments;

}
