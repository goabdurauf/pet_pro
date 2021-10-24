package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 22.10.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "shipping")
public class ShippingEntity extends BaseEntity {
    private String num;
    private UUID managerId;
    private String managerName;
    private UUID carrierId;
    private BigDecimal price;
    private long currencyId;
    private BigDecimal rate;
    private BigDecimal finalPrice;
    private long shippingTypeId;
    private String shippingNum;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Attachment> attachments;
}
