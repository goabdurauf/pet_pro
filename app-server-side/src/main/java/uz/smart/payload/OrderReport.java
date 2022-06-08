package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderReport {
    private Long rowNum;
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
