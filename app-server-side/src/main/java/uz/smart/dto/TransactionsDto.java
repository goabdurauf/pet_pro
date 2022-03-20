package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 16.01.2022.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class TransactionsDto {

    private UUID id;
    private Integer kassaType;

    private String num;
    private Timestamp date;

    private UUID clientId;
    private UUID kassaId;
    private String kassaName;
    private UUID carrierId;
    private Long agentId;

    private String sourceName;
    private String sourceType;

    private Long currencyInId;
    private String currencyInName;
    private Long currencyId;
    private String currencyName;
    private BigDecimal price;
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private String comment;

    private String invoiceStatus;
    Set<TransactionsInvoicesDto> invoices = new HashSet<>();

}
