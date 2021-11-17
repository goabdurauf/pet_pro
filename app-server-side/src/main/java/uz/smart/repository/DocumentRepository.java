package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 17.11.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.DocumentEntity;

import java.util.UUID;

public interface DocumentRepository extends JpaRepository<DocumentEntity, UUID> {
}
