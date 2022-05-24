package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResShippingIncome {
    private UUID id;
    private String shippingNum;
    private String transportNum;
    private String cargoNum;
    private String ownerName;

    private BigDecimal agreementPrice;
    private String agreementCurrencyName;
    private BigDecimal agreementRate;
    private BigDecimal agreementFinalPrice;
    private BigDecimal agreementTotal;
    private BigDecimal apprIncome;

    private BigDecimal paidPrice;
    private BigDecimal paidRate;
    private BigDecimal paidPercent;
    private BigDecimal paidTotalPercent;

    private BigDecimal paidAgreementPrice;
    private String paidAgreementCurrencyName;
    private BigDecimal paidAgreementRate;
    private BigDecimal paidAgreementFinalPrice;
    private BigDecimal paidAgreementTotalPrice;
    private BigDecimal incomeTotal;
}
