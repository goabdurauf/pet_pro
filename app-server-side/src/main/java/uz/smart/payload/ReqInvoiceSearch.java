package uz.smart.payload;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data
public class ReqInvoiceSearch extends ReqSearch {
    private String word;
    private UUID clientId;
    private UUID carrierId;
}
