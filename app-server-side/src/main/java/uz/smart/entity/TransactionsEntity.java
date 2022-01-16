package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 15.01.2022.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "transactions")
public class TransactionsEntity extends BaseEntity {

    private Integer kassaType;     //  100+ - in, 200+ - out | 101 - client, 102 - agent, 103 - carrier
    private String num;
    private Timestamp date;

    @ManyToOne(fetch = FetchType.LAZY)
    private ClientEntity client;
    @ManyToOne(fetch = FetchType.LAZY)
    private KassaEntity kassa;
    @ManyToOne(fetch = FetchType.LAZY)
    private CarrierEntity carrier;
    private Long agentId;

    private Long currencyId;
    private String currencyName;
    private BigDecimal price;
    @Column(precision = 19, scale = 4)
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private String comment;

}
