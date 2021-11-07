package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.converter.DateTimeDeserializer;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class CargoDto {
    private UUID id;
    private String name;
    private String code;
    private String comment;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp loadDate;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp unloadDate;

    private List<CargoDetailDto> cargoDetails;

    private String senderName;
    private Long senderCountryId;
    private String senderCity;
    private String senderOthers;

    private String receiverName;
    private Long receiverCountryId;
    private String receiverCity;
    private String receiverOthers;

    private String customFromName;
    private Long customFromCountryId;
    private String customFromCity;
    private String customFromOthers;

    private String customToName;
    private Long customToCountryId;
    private String customToCity;
    private String customToOthers;

    private List<UUID> senderAttachments;
    private List<UUID> receiverAttachments;
    private List<UUID> customFromAttachments;
    private List<UUID> customToAttachments;
}
