package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.sql.Timestamp;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "cargo")
public class CargoEntity extends BaseEntity {

    private String name;
    private String code;
    private Timestamp loadDate;
    private Timestamp unloadDate;
    private String comment;

    @OneToMany(fetch = FetchType.LAZY)
    private List<CargoDetailEntity> cargoDetails;

    private String senderName;
    private Long senderCountryId;
    private String senderCountryName;
    private String senderCity;
    private String senderOthers;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment senderAttachment;

    private String receiverName;
    private Long receiverCountryId;
    private String receiverCountryName;
    private String receiverCity;
    private String receiverOthers;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment receiverAttachment;

    private String customFromName;
    private Long customFromCountryId;
    private String customFromCountryName;
    private String customFromCity;
    private String customFromOthers;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment customFromAttachment;

    private String customToName;
    private Long customToCountryId;
    private String customToCountryName;
    private String customToCity;
    private String customToOthers;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment customToAttachment;

}
