package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import uz.smart.entity.enums.BalanceType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "balances")
@IdClass(value = BalancesEntityPK.class)
public class BalancesEntity {
    @Id
    private UUID ownerId;
    @Id
    private Long currencyId;

    private String currencyName;
    private BigDecimal balance = BigDecimal.ZERO;
    private BalanceType type;

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;

    public BalancesEntity(UUID ownerId, Long currencyId, String currencyName, BalanceType type) {
        this.ownerId = ownerId;
        this.currencyId = currencyId;
        this.currencyName = currencyName;
        this.type = type;
    }
}
