package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.CarrierEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CarrierRepository extends JpaRepository<CarrierEntity, UUID> {

    @Transactional
    @Modifying
    @Query("update carrier set state=0 where id = :id")
    void updateById(UUID id);

    @Query("select c from carrier c where c.state > 0 and c.id = :id")
    Optional<CarrierEntity> getCarrierById(UUID id);

    @Query("select c from carrier c where c.state > 0 order by c.createdAt")
    List<CarrierEntity> getAllCarriers();
}
