package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.ClientEntity;
import uz.smart.entity.SupplierEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SupplierRepository extends JpaRepository<SupplierEntity, UUID> {

    @Transactional
    @Modifying
    @Query("update suppliers set state=0 where id = :id")
    void updateById(UUID id);

    @Query("select s from suppliers s where s.state > 0 and s.id = :id")
    Optional<SupplierEntity> getSupplierById(UUID id);

    @Query("select s from suppliers s where s.state > 0 order by s.createdAt")
    List<SupplierEntity> getAllSuppliers();
}
