package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.smart.entity.CargoEntity;
import uz.smart.entity.InvoiceEntity;
import uz.smart.entity.ShippingEntity;

import java.util.Collection;
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

    List<InvoiceEntity> findAllByShipping(ShippingEntity shipping);
    List<InvoiceEntity> findAllByCargo(CargoEntity cargo);

    Optional<InvoiceEntity> getFirstByOrderByUpdatedAtDesc();


    //Get invoice state by cargo id
    @Query(value = "select state from invoices where cargo_id = :cargoId", nativeQuery = true)
    List<Integer> getStatesByCargoId(UUID cargoId);

    //Get invoice state by shipping id
    @Query(value = "select state from invoices where shipping_id = :shippingId", nativeQuery = true)
    List<Integer> getStatesByShippingId(UUID shippingId);
}
