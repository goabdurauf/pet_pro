package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.BalancesEntity;
import uz.smart.entity.BalancesEntityPK;

import java.util.List;
import java.util.UUID;

public interface BalancesRepository extends JpaRepository<BalancesEntity, BalancesEntityPK> {

    List<BalancesEntity> getAllByOwnerId(UUID ownerId);

}
