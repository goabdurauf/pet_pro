package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.CargoEntity;
import uz.smart.entity.DocumentEntity;
import uz.smart.entity.ExpenseEntity;

import java.util.*;

public interface CargoRepository extends JpaRepository<CargoEntity, UUID> {

  @Query("select c from cargo c where c.state > 0 and c.id = :id")
  Optional<CargoEntity> getCargoById(UUID id);

  @Query("select c from cargo c where c.state > 0 order by c.createdAt desc")
  List<CargoEntity> getAllCargos();

  @Query(value = "select * from cargo c " +
          " left join orders o on c.order_id = o.id " +
          " left join shipping s on c.shipping_id = s.id " +
          " where c.state = 1 " +
          " and (c.load_date is null or c.load_date between :loadStart and :loadEnd) " +
          " and (c.unload_date is null or c.unload_date between :unloadStart and :unloadEnd) " +
          " and ( (:cargoNum is null or lower(c.num) like concat('%', :cargoNum, '%')) " +
          "       or (:cargoName is null or lower(c.name) like concat('%', :cargoName, '%')) " +
          "       or (:orderNum is null or lower(o.num) like concat('%', :orderNum, '%')) " +
          "       or (:shippingNum is null or lower(s.num) like concat('%', :shippingNum, '%')) ) " +
          " and (:clientId is null or o.client_id = cast(cast(:clientId as text) as uuid)) " +
          " and (:carrierId is null or s.carrier_id = cast(cast(:carrierId as text) as uuid)) " +
          " and (:senderCountryId is null or c.sender_country_id = cast(cast(:senderCountryId as text) as bigint)) " +
          " and (:receiverCountryId is null or c.receiver_country_id = cast(cast(:receiverCountryId as text) as bigint)) " +
          " and (:statusId is null or c.status_id = cast(cast(:statusId as text) as bigint)) " +
          " order by c.load_date desc offset :page rows fetch first :size rows only ", nativeQuery = true)
  Set<CargoEntity> getCargoListByFilter(String orderNum, String shippingNum, String cargoNum, String cargoName,
                                        UUID clientId, UUID carrierId, Long senderCountryId, Long receiverCountryId, Long statusId,
                                        Date loadStart, Date loadEnd, Date unloadStart, Date unloadEnd,
                                        int page, int size);

  @Query(value = "select count(*) " +
          " from (select distinct c.id from cargo c " +
          "       left join orders o on c.order_id = o.id " +
          "       left join shipping s on c.shipping_id = s.id " +
          "       where c.state = 1 " +
          "       and (c.load_date is null or c.load_date between :loadStart and :loadEnd) " +
          "       and (c.unload_date is null or c.unload_date between :unloadStart and :unloadEnd) " +
          "       and ( (:cargoNum is null or lower(c.num) like concat('%', :cargoNum, '%')) " +
          "             or (:cargoName is null or lower(c.name) like concat('%', :cargoName, '%')) " +
          "             or (:orderNum is null or lower(o.num) like concat('%', :orderNum, '%')) " +
          "             or (:shippingNum is null or lower(s.num) like concat('%', :shippingNum, '%')) ) " +
          "       and (:clientId is null or o.client_id = cast(cast(:clientId as text) as uuid)) " +
          "       and (:carrierId is null or s.carrier_id = cast(cast(:carrierId as text) as uuid)) " +
          "       and (:senderCountryId is null or c.sender_country_id = cast(cast(:senderCountryId as text) as bigint)) " +
          "       and (:receiverCountryId is null or c.receiver_country_id = cast(cast(:receiverCountryId as text) as bigint)) " +
          "       and (:statusId is null or c.status_id = cast(cast(:statusId as text) as bigint)) " +
          " ) t ", nativeQuery = true)
  long getCargoCountByFilter(String orderNum, String shippingNum, String cargoNum, String cargoName,
                             UUID clientId, UUID carrierId, Long senderCountryId, Long receiverCountryId, Long statusId,
                             Date loadStart, Date loadEnd, Date unloadStart, Date unloadEnd);

  List<CargoEntity> getAllByOrder_IdAndStateOrderByCreatedAt(UUID order_id, int state);

  List<CargoEntity> getAllByShippingIsNullOrderByCreatedAt();

  Optional<CargoEntity> findByDocumentListIn(List<DocumentEntity> documentList);

  Optional<CargoEntity> findByExpenseListIn(List<ExpenseEntity> expenseList);


  //Get cargo's state by order id
  @Query(value = "select state from cargo o where o.order_id = :orderId", nativeQuery = true)
  List<Integer> getStatesByOrderId(UUID orderId);

  //Update cargo's state
  @Modifying
  @Transactional
  @Query("update cargo set state = 0 where id = :id")
  void updateById(UUID id);


  @Query(value = "select * from cargo where state != 0 and order_id = :orderId", nativeQuery = true)
  List<CargoEntity> getAllCargosByOrderId(UUID orderId);
}
