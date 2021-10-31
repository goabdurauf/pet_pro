package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.ShippingEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ShippingRepository extends JpaRepository<ShippingEntity, UUID> {

    @Transactional
    @Modifying
    @Query("update shipping set state=0 where id = :id")
    void updateById(UUID id);

    @Query("select s from shipping s where s.state > 0 and s.id = :id")
    Optional<ShippingEntity> getShippingById(UUID id);

    @Query("select s from shipping s where s.state > 0 order by s.createdAt")
    List<ShippingEntity> getAllShipping();
}
