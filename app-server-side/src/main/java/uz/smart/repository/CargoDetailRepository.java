package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.CargoDetailEntity;

import java.util.UUID;

public interface CargoDetailRepository extends JpaRepository<CargoDetailEntity, UUID> {

}
