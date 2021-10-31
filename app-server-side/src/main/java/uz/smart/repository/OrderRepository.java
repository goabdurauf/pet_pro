package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.OrderEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {

    @Transactional
    @Modifying
    @Query("update orders set state=0 where id = :id")
    void updateById(UUID id);

    @Query("select o from orders o where o.state > 0 and o.id = :id")
    Optional<OrderEntity> getOrderById(UUID id);

    @Query("select o from orders o where o.state > 0 order by o.createdAt")
    List<OrderEntity> getAllOrders();
}
