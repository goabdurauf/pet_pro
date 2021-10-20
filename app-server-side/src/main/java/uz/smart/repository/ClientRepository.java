package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 19.10.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.ClientEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ClientRepository extends JpaRepository<ClientEntity, UUID> {

    @Transactional
    @Modifying
    @Query("update clients set state=0 where id = :id")
    void updateById(UUID id);

    @Query("select c from clients c where c.state > 0 and c.id = :id")
    Optional<ClientEntity> getClientById(UUID id);

    @Query("select c from clients c where c.state > 0 order by c.createdAt")
    List<ClientEntity> getAllClients();
}
