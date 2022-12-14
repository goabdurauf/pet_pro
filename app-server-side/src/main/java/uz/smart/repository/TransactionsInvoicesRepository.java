package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 16.01.2022. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.TransactionsInvoicesEntity;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface TransactionsInvoicesRepository extends JpaRepository<TransactionsInvoicesEntity, UUID> {

    List<TransactionsInvoicesEntity> findAllByTransactionId(UUID transactionId);
    long countAllByTransactionId(UUID transactionId);

    List<TransactionsInvoicesEntity> findAllByInvoiceIdInAndKassaTypeIn(List<UUID> invoiceId, List<Integer> kassaType);

}
