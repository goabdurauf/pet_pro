package uz.smart.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "product")
public class ProductEntity extends BaseEntity {

    private String name;
    private String code;
    private long measureId;
    private String measureName;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Attachment> attachments;
}
