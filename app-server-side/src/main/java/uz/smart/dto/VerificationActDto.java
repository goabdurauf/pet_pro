package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 24.04.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class VerificationActDto {
    private UUID id;
    private boolean isHeader = false;
    private String ownerName;
    private String currencyName;
    private String name;
    private String serviceName;
    private String shippingNum;
    private String transportNum;
    private BigDecimal debitSum;
    private BigDecimal rate;
    private BigDecimal debitFinalSum;
    private BigDecimal creditSum;
    private BigDecimal creditFinalSum;

    public VerificationActDto(UUID id, boolean isHeader, String ownerName, String currencyName, BigDecimal summa) {
        this.id = id;
        this.isHeader = isHeader;
        this.ownerName = ownerName;
        this.currencyName = currencyName;
        this.debitSum = summa;
        this.debitFinalSum = summa;
        this.creditSum = summa;
        this.creditFinalSum = summa;
    }
}
