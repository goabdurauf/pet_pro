package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 15.01.2022. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.TransactionsEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<TransactionsEntity, UUID> {

    Optional<TransactionsEntity> getFirstByOrderByCreatedAtDesc();

    List<TransactionsEntity> findAllByOrderByDateDesc();

}
