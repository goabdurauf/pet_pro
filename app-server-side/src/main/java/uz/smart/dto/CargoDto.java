package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.converter.DateTimeDeserializer;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class CargoDto {
    private UUID id;
    private String name;
    private String code;
    private String comment;
    private UUID orderId;
    private Long regTypeId;
    private String regTypeName;

    private Long transportKindId;
    private String transportKindName;
    private Long transportConditionId;
    private String transportConditionName;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp loadDate;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp unloadDate;

    private Long currencyId;
    private String currencyName;
    private BigDecimal price;
    private BigDecimal rate;
    private BigDecimal finalPrice;

    private List<CargoDetailDto> cargoDetails;

    private String senderName;
    private Long senderCountryId;
    private String senderCountryName;
    private String senderCity;
    private String senderOthers;

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
}
