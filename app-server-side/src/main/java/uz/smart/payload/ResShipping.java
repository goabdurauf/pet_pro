package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.dto.DocumentDto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResShipping {
    private UUID id;
    private String num;
    private String shippingNum;
    private String managerName;
    private String carrierName;
    private String currencyName;
    private BigDecimal price;
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private String shippingTypeName;
    private BigDecimal shippingTypeCapacity;
    private BigDecimal shippingTypeWeight;
    private String shippingTypeSize;
    private int statusId;

    private Long transportKindId;
    private String transportKindName;
    private Long transportConditionId;
    private String transportConditionName;

    private Timestamp loadDate;
    private String loadStation;
    private Timestamp loadSendDate;

    private Timestamp customArrivalDate;
    private String customStation;
    private Timestamp customSendDate;

    private Timestamp unloadArrivalDate;
    private String unloadStation;
    private Timestamp unloadDate;

    private List<ResOrder> orderList;
    private List<ResCargo> cargoList;
    private List<DocumentDto> documents;
}
