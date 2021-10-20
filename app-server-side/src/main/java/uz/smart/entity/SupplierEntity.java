package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "suppliers")
public class SupplierEntity extends BaseEntity {

    private String name;
    private String contactPerson;
    private String phone;
    private Long countryId;
    private String countryName;
    private String city;
    private UUID managerId;
    private String sourceFrom;

}
