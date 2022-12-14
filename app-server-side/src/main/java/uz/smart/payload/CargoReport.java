package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uz.smart.dto.CargoDetailDto;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

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
  private String cargoDetails;
  private String carrierName;
  private String shippingNum;
  private String toPrice;
  private String fromPrice;
}
