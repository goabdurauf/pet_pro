package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.CargoEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CargoRepository extends JpaRepository<CargoEntity, UUID> {

    @Transactional
    @Modifying
    @Query("update cargo set state=0 where id = :id")
    void updateById(UUID id);

    @Query("select c from cargo c where c.state > 0 and c.id = :id")
    Optional<CargoEntity> getCargoById(UUID id);

    @Query("select c from cargo c where c.state > 0 order by c.createdAt desc")
    List<CargoEntity> getAllCargos();

    List<CargoEntity> getAllByOrder_IdAndStateGreaterThan(UUID order_id, int state);

}
