package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 27.03.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class CargoTrackingDto {

    private UUID id;
    private Long factoryAddressId;
    private String factoryAddress;
    private Long loadStationId;
    private String loadStation;
    private Long unloadStationId;
    private String unloadStation;
    private Long chaseStatusId;
    private String chaseStatus;
    private String chaseStatusColor;
    private String cargoName;
    private String kazahNumber;
    private String currentLocation;
    private String comment;

    private Long durationDays;
    private String shippingNum;
    private String transportNum;
    private String carrierName;
    private String shippingType;
    private String transportKind;
    private BigDecimal cargoWeight = BigDecimal.ZERO;

    private Timestamp loadDate;
    private Timestamp docPassDate;
    private Timestamp loadSendDate;
    private Timestamp customArrivalDate;
    private Timestamp customSendDate;
    private Timestamp containerReturnDate;
    private Timestamp unloadDate;

}
