package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CargoReport {
  private String orderNum;
  private String cargoNum;
  private String clientName;
  private Date loadDate;
  private Date unloadDate;
  private String senderCountryName;
  private String receiverCountryName;
  private String statusName;

  private String name;
  private String weight;
  private String capacity;
  private String packageAmount;

  private String carrierName;
  private String shippingNum;

  private String currencyName;
  private Double price;
  private Double rate;
  private Double finalPrice;

  private String fromCurrencyName;
  private Double fromPrice;
  private Double fromRate;
  private Double fromFinalPrice;

  private String toCurrencyName;
  private Double toPrice;
  private Double toRate;
  private Double toFinalPrice;

  private String invoiceOutId;
  private String invoiceInId;

}
