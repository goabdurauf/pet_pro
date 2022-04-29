package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 28.12.2021. 
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
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "invoices")
public class InvoiceEntity extends BaseEntity {

    private Integer num;
    private Long currencyId;
    private String currencyName;
    private BigDecimal price;
    @Column(precision = 19, scale = 4)
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private String comment;
    private UUID carrierId;
    private UUID clientId;
    private int type;   // 1 - Трансортная услуга (рейс), 2 - Расход рейса, 3 - расход груза, 4 - расход груза по рейсам, 5 - cargo out

    private BigDecimal balance = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    private ShippingEntity shipping;

    @ManyToOne(fetch = FetchType.LAZY)
    private CargoEntity cargo;

}
