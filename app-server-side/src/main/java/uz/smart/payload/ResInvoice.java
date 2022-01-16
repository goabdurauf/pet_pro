package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 29.12.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.dto.InvoiceDto;

import java.math.BigDecimal;
import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResInvoice extends InvoiceDto {
    private String name;
    private Date invoiceDate;
    private String shipNum;
    private String transportNum;
    private String carrierName;
    private String clientName;
    private BigDecimal balance;

}
