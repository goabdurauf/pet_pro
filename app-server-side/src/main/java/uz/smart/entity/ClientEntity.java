package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 19.10.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import java.math.BigDecimal;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "clients")
public class ClientEntity extends BaseEntity {

    private String name;
    private String contactPerson;
    private String phone;
    private long countryId;
    private String countryName;
    private String city;
    private UUID managerId;
    private Long aboutId;
    private String aboutName;
    private BigDecimal balance = BigDecimal.ZERO;

}
