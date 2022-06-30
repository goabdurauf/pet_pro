package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShippingReport {
  private String num;
  private String orderNum;
  private Date loadDate;
  private Date unloadDate;
  private String clientName;
  private String managerName;
  private String carrierName;
  private String currencyName;
  private BigDecimal price;
  private BigDecimal finalPrice;
  private String shippingTypeName;
  private String shippingNum;
  private String toPrice;
  private String fromPrice;

}