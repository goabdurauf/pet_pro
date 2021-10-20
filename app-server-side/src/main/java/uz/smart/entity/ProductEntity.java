package uz.smart.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;
import javax.persistence.Entity;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "product")
public class ProductEntity extends BaseEntity {

    private String name;
    private String code;
    private long measureId;
    private String measureName;

}
