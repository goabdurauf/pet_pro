package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;
import javax.persistence.Entity;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "carrier")
public class CarrierEntity extends BaseEntity {
    private String name;
    private String phone;
    private Long countryId;
    private String countryName;
    private String city;
}
