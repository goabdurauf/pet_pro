package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021.
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
public class ShippingDto {
    private UUID id;
    private UUID managerId;
    private UUID carrierId;
    private Long currencyId;
    private BigDecimal price;
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private long shippingTypeId;
    private String shippingNum;
    private UUID orderId;
    private Integer statusId;
    private List<UUID> cargoList;
    private List<OrderSelectDto> orderSelect;
    private String comment;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp loadDate;
    private String loadStation;
    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp loadSendDate;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp customArrivalDate;
    private String customStation;
    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp customSendDate;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp unloadArrivalDate;
    private String unloadStation;
    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp unloadDate;
}
