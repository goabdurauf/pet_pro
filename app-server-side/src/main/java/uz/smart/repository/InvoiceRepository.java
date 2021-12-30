package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.InvoiceEntity;

import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, UUID> {
}
