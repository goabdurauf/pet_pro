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
}
