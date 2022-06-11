package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.smart.entity.CargoEntity;
import uz.smart.entity.InvoiceEntity;
import uz.smart.entity.ShippingEntity;

import java.util.*;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, UUID> {

    @Query("select i from invoices i where i.state = 1 and i.type in (:types) order by i.createdAt desc ")
    List<InvoiceEntity> getAllInvoices(List<Integer> types);

    @Query(value = "select * from invoices i " +
            "   left join expenses e on i.id = e.invoice_out_id " +
            "   left join cargo c on i.cargo_id = c.id " +
            "   left join shipping s on c.shipping_id = s.id " +
            " where i.state = 1 and i.type in (:types) " +
            " and (i.created_at between :start and :end) " +
            " and ((:expenseName is null or lower(case when i.type = 4 then e.name else 'ставка за груз' end) like concat('%', :expenseName, '%')) " +
            "      or (:shippingNum is null or lower(s.num) like concat('%', :shippingNum, '%')) " +
            "      or (:transportNum is null or lower(s.shipping_num) like concat('%', :transportNum, '%'))) " +
            " and (:clientId is null or i.client_id = cast(cast(:clientId as text) as uuid)) " +
            " order by i.created_at desc offset :off rows fetch first :cnt rows only ", nativeQuery = true)
    Set<InvoiceEntity> getInvoicesOutByFilter(String expenseName, String shippingNum, String transportNum,
                                              UUID clientId, Date start, Date end, int off, int cnt, List<Integer> types);
    @Query(value = "select count(*) " +
            " from (select distinct i.id from invoices i " +
            "         left join expenses e on i.id = e.invoice_out_id " +
            "         left join cargo c on i.cargo_id = c.id " +
            "         left join shipping s on c.shipping_id = s.id " +
            "       where i.state = 1 and i.type in (:types) " +
            "       and (i.created_at between :start and :end) " +
            "       and ((:expenseName is null or lower(case when i.type = 4 then e.name else 'ставка за груз' end) like concat('%', :expenseName, '%')) " +
            "            or (:shippingNum is null or lower(s.num) like concat('%', :shippingNum, '%')) " +
            "            or (:transportNum is null or lower(s.shipping_num) like concat('%', :transportNum, '%'))) " +
            "       and (:clientId is null or i.client_id = cast(cast(:clientId as text) as uuid)) " +
            " ) t ", nativeQuery = true)
    long getInvoicesOutCount(String expenseName, String shippingNum, String transportNum,
                                              UUID clientId, Date start, Date end, List<Integer> types);
    @Query(value = "select * from invoices i " +
            "   left join expenses e on i.id = e.invoice_in_id " +
            "   left join cargo c on i.cargo_id = c.id " +
            "   left join shipping s1 on i.shipping_id = s1.id " +
            "   left join shipping s2 on c.shipping_id = s2.id " +
            " where i.state = 1 and i.type in (:types) " +
            " and (i.created_at between :start and :end) " +
            " and ((:expenseName is null or lower(coalesce(e.name,'трансортная услуга (рейс)')) like concat('%', :expenseName, '%')) " +
            "      or (:shippingNum is null or lower(case when i.type = 3 then s2.num else s1.num end) like concat('%', :shippingNum, '%')) " +
            "      or (:transportNum is null or lower(case when i.type = 3 then s2.shipping_num else s1.shipping_num end) like concat('%', :transportNum, '%'))) " +
            " and (:carrierId is null or i.carrier_id = cast(cast(:carrierId as text) as uuid)) " +
            " order by i.created_at desc offset :off rows fetch first :cnt rows only ", nativeQuery = true)
    Set<InvoiceEntity> getInvoicesInByFilter(String expenseName, String shippingNum, String transportNum,
                                              UUID carrierId, Date start, Date end, int off, int cnt, List<Integer> types);
    @Query(value = "select count(*) " +
            " from (select distinct i.id from invoices i " +
            "         left join expenses e on i.id = e.invoice_in_id " +
            "         left join cargo c on i.cargo_id = c.id " +
            "         left join shipping s1 on i.shipping_id = s1.id " +
            "         left join shipping s2 on c.shipping_id = s2.id " +
            "       where i.state = 1 and i.type in (:types) " +
            "       and (i.created_at between :start and :end) " +
            "       and ((:expenseName is null or lower(coalesce(e.name,'трансортная услуга (рейс)')) like concat('%', :expenseName, '%')) " +
            "            or (:shippingNum is null or lower(case when i.type = 3 then s2.num else s1.num end) like concat('%', :shippingNum, '%')) " +
            "            or (:transportNum is null or lower(case when i.type = 3 then s2.shipping_num else s1.shipping_num end) like concat('%', :transportNum, '%'))) " +
            "       and (:carrierId is null or i.carrier_id = cast(cast(:carrierId as text) as uuid)) " +
            " ) t ", nativeQuery = true)
    long getInvoicesInCount(String expenseName, String shippingNum, String transportNum,
                                              UUID carrierId, Date start, Date end, List<Integer> types);


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
