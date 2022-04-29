package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.smart.entity.InvoiceEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, UUID> {

    @Query("select i from invoices i where i.state = 1 and i.type in (:types) order by i.createdAt desc ")
    List<InvoiceEntity> getAllInvoices(List<Integer> types);

    @Query("select i from invoices i where i.state = 1 and i.clientId = :clientId and i.type in (:types) order by i.createdAt desc ")
    List<InvoiceEntity> findAllByClientIdAndType(UUID clientId, List<Integer> types);

    @Query("select i from invoices i where i.state = 1 and i.carrierId = :carrierId and i.type in (:types) order by i.createdAt desc ")
    List<InvoiceEntity> findAllByCarrierIdAndType(UUID carrierId, List<Integer> types);

    @Query("select i from invoices i where i.state = 1 and i.clientId = :clientId and i.type in (:types) and i.currencyId = :currencyId and i.balance < 0 order by i.createdAt desc ")
    List<InvoiceEntity> findAllByClientIdAndTypeAndCurrency(UUID clientId, List<Integer> types, Long currencyId);

    @Query("select i from invoices i where i.state = 1 and i.carrierId = :carrierId and i.type in (:types) and i.currencyId = :currencyId and i.balance < 0 order by i.createdAt desc ")
    List<InvoiceEntity> findAllByCarrierIdAndTypeAndCurrency(UUID carrierId, List<Integer> types, Long currencyId);

    Optional<InvoiceEntity> getFirstByOrderByUpdatedAtDesc();
}
