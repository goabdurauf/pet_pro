package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 16.01.2022.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "transactions_invoices")
public class TransactionsInvoicesEntity extends BaseEntity {

    private UUID transactionId;
    private UUID invoiceId;
    private BigDecimal price;

}
