package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.smart.entity.InvoiceEntity;

import java.util.List;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<InvoiceEntity, UUID> {

    @Query("select i from invoices i where i.state > 0 and i.type in (:types) order by i.createdAt desc ")
    List<InvoiceEntity> getAllInvoices(List<Integer> types);

}
