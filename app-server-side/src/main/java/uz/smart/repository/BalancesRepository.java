package uz.smart.repository;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.smart.entity.BalancesEntity;
import uz.smart.entity.BalancesEntityPK;
import uz.smart.entity.enums.BalanceType;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BalancesRepository extends JpaRepository<BalancesEntity, BalancesEntityPK> {

    List<BalancesEntity> getAllByOwnerId(UUID ownerId);

    @Query(value = "select sum(balance) from balances where currencyId=:currencyId and type=:type and date(createdAt) <= :toDate")
    BigDecimal getBalanceByCurrencyAndType(Long currencyId, BalanceType type, Date toDate);

    Optional<BalancesEntity> getByCurrencyIdAndOwnerId(Long currencyId, UUID ownerId);
}
