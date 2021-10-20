package uz.smart.entity.template;

/*
    Created by Ilhom Ahmadjonov on 19.10.2021. 
*/

import lombok.Data;
import javax.persistence.MappedSuperclass;
import javax.persistence.PreUpdate;

@Data @MappedSuperclass
public class BaseEntity extends AbsEntity{

    private int state = 1;
    private int version = 1;

    @PreUpdate
    private void preUpdate() {version += 1;}

}
