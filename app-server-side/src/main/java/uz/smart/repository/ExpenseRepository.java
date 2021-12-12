package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 12.12.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.ExpenseEntity;

import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<ExpenseEntity, UUID> {
}
