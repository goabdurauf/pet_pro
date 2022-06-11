package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021. 
*/

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.OrderEntity;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {

  @Query("select o from orders o where o.state = 1 and o.id = :id")
  Optional<OrderEntity> getOrderById(UUID id);

  @Query("select o from orders o where o.state = 1 order by o.createdAt desc ")
  Page<OrderEntity> getAllOrders(Pageable pageable);

  @Query(value = "select o from orders o " +
          " where o.state = 1  " +
          " and (o.date between :fromDate and :toDate) " +
          " and (:clientId is null or cast(o.clientId as org.hibernate.type.UUIDCharType) = :clientId) " +
          " and (:managerId is null or cast(o.managerId as org.hibernate.type.UUIDCharType) = :managerId) " +
          " and (:statusId is null or o.statusId = :statusId) " +
          " and (:num is null or o.num like concat('%', :num)) " +
          " order by o.date desc ")
  Page<OrderEntity> getOrdersByFilter(String num, Date fromDate, Date toDate, UUID clientId, UUID managerId, Long statusId, Pageable pageable);

  @Query("select o from orders o where o.state = 1 and o.num like concat('%', :num, '%')")
  List<OrderEntity> searchByNum(String num);

  Optional<OrderEntity> getFirstByOrderByCreatedAtDesc();

  Optional<OrderEntity> getFirstByClientIdOrderByCreatedAtDesc(UUID clientId);

  @Query(value = "select coalesce(count(*), 0) soni from (select * from (select client_id, (date(now()) - date(max(date))) days " +
          " from orders group by client_id) o order by o.days) t where days < :days ", nativeQuery = true)
  long getActiveClientsCount(long days);




  //Get order's state by client id
  @Query(value = "select state as states from orders o where o.client_id = :clientId", nativeQuery = true)
  List<Integer> getStatesByClientId(UUID clientId);

  //Update order's state
  @Modifying
  @Transactional
  @Query("update orders set state=0 where id = :id")
  void updateById(UUID id);
}
