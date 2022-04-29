package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 22.04.2022. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.VerificationActEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VerificationActRepository extends JpaRepository<VerificationActEntity, UUID> {

    List<VerificationActEntity> findAllByOwnerIdAndCurrencyIdOrderByDate(UUID ownerId, Long currencyId);

    Optional<VerificationActEntity> findByDocId(UUID docId);
}
