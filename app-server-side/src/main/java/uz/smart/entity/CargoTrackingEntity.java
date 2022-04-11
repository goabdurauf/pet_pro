package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 27.03.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.FetchType;
import javax.persistence.OneToOne;
import java.sql.Timestamp;

@Data @NoArgsConstructor @AllArgsConstructor
//@Entity(name = "cargo_tracking")
public class CargoTrackingEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    private ShippingEntity shipping;

    private Long factoryAddressId;
    private Long departureStationId;
    private Long arrivalStationId;
    private Long chaseStatusId;
    private String cargoName;
    private String kazahNumber;
    private String currentLocation;
    private Long durationDays;

    private Timestamp loadDate;
    private Timestamp docPassDate;
    private Timestamp shippingDepartureDate;
    private Timestamp transitArrivalDate;
    private Timestamp transitDepartureDate;
    private Timestamp containerReturnDate;
    private Timestamp unloadDate;

}
