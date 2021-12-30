package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 29.12.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.dto.InvoiceDto;

import java.util.Date;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResInvoice extends InvoiceDto {
    private Date invoiceDate;
    private String shipNum;
    private String transportNum;

}
