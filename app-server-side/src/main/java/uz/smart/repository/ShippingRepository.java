package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.CargoEntity;
import uz.smart.entity.OrderEntity;
import uz.smart.entity.ShippingEntity;
import uz.smart.entity.enums.ShippingStatus;

import java.util.*;

public interface ShippingRepository extends JpaRepository<ShippingEntity, UUID> {

    @Transactional
    @Modifying
    @Query("delete from shipping where id = :id")
    void updateById(UUID id);

    @Query("select s from shipping s where s.state = 1 and s.id = :id")
    Optional<ShippingEntity> getShippingById(UUID id);

    @Query("select s from shipping s where s.state = 1 order by s.createdAt")
    List<ShippingEntity> getAllShipping();

    @Query(value = "select * from shipping s " +
            " left join shipping_order so on s.id = so.shipping_id " +
            " left join orders o on so.order_id = o.id " +
            " where s.state = 1 " +
            " and (s.load_date is null or s.load_date between :loadStart and :loadEnd) " +
            " and (s.unload_date is null or s.unload_date between :unloadStart and :unloadEnd) " +
            " and (:transportKindId is null or s.transport_kind_id = cast(cast(:transportKindId as text) as bigint)) " +
            " and ( (:num is null or lower(s.num) like concat('%', :num, '%')) " +
            "      or (:shippingNum is null or lower(s.shipping_num) is null or s.shipping_num like concat('%', :shippingNum, '%')) " +
            "      or (:orderNum is null or lower(o.num) like concat('%', :orderNum, '%')) ) " +
            " and (:clientId is null or o.client_id = cast(cast(:clientId as text) as uuid)) " +
            " and (:carrierId is null or s.carrier_id = cast(cast(:carrierId as text) as uuid)) " +
            " and (:managerId is null or s.manager_id = cast(cast(:managerId as text) as uuid)) " +
            " order by s.load_date desc offset :page rows fetch first :size rows only ", nativeQuery = true)
    Set<ShippingEntity> getShippingByFilter(String num, String shippingNum, String orderNum, Long transportKindId,
                                            UUID clientId, UUID carrierId, UUID managerId,
                                            Date loadStart, Date loadEnd, Date unloadStart, Date unloadEnd, int page, int size);

    @Query(value = "select count(*) " +
            " from (select distinct s.id from shipping s " +
            "       left join shipping_order so on s.id = so.shipping_id " +
            "       left join orders o on so.order_id = o.id " +
            "       where s.state = 1 " +
            "       and (s.load_date is null or s.load_date between :loadStart and :loadEnd) " +
            "       and (s.unload_date is null or s.unload_date between :unloadStart and :unloadEnd) " +
            "       and (:transportKindId is null or s.transport_kind_id = cast(cast(:transportKindId as text) as bigint)) " +
            "       and ( (:num is null or lower(s.num) like concat('%', :num, '%')) " +
            "            or (:shippingNum is null or lower(s.shipping_num) is null or s.shipping_num like concat('%', :shippingNum, '%')) " +
            "            or (:orderNum is null or lower(o.num) like concat('%', :orderNum, '%')) ) " +
            "       and (:clientId is null or o.client_id = cast(cast(:clientId as text) as uuid)) " +
            "       and (:carrierId is null or s.carrier_id = cast(cast(:carrierId as text) as uuid)) " +
            "       and (:managerId is null or s.manager_id = cast(cast(:managerId as text) as uuid)) " +
            " ) t ", nativeQuery = true)
    long getShippingCountByFilter(String num, String shippingNum, String orderNum, Long transportKindId,
                                            UUID clientId, UUID carrierId, UUID managerId,
                                            Date loadStart, Date loadEnd, Date unloadStart, Date unloadEnd);

    List<ShippingEntity> getAllByOrderEntitiesInAndStateGreaterThan(List<OrderEntity> orderEntities, int state);

    Optional<ShippingEntity> getByCargoEntitiesIn(List<CargoEntity> cargoEntities);

//    Optional<ShippingEntity> getFirstByOrderByCreatedAtDesc();
    Optional<ShippingEntity> getFirstByStatusOrderByCreatedAtDesc(ShippingStatus status);
}
