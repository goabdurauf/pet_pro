package uz.smart.payload;

import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderReport {
    private String num;
    private Date date;
    private String clientName;
    private String managerName;
    private Long statusId;
    private String statusName;
    private String statusColor;
    private String shippingNum;
    private String currierName;
    private String transportNum;
}
