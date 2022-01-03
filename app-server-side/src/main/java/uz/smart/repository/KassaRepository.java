package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 02.01.2022. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.KassaEntity;

import java.util.List;
import java.util.UUID;

public interface KassaRepository extends JpaRepository<KassaEntity, UUID> {

    List<KassaEntity> findAllByStateGreaterThanOrderByCreatedAtDesc(int state);

    @Transactional
    @Modifying
    @Query("update kassalar set state=0 where id = :id")
    void updateById(UUID id);
}
