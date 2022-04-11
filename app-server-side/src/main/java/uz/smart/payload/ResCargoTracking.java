package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 27.03.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.smart.dto.CargoTrackingDto;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class ResCargoTracking extends CargoTrackingDto {

    private String factoryAddress;
    private String departureStation;
    private String arrivalStation;
    private String chaseStatus;
    private Long durationDays;
    private String shippingNum;
    private String transportNum;
    private String carrierName;
    private String shippingType;
    private String transportKind;
    private BigDecimal cargoWeight = BigDecimal.ZERO;


}
