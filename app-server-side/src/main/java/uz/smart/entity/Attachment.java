package uz.smart.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.AbsEntity;

import javax.persistence.Column;
import javax.persistence.Entity;

@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "Attachment")
public class Attachment extends AbsEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contentType;

    private String docType;
    private long size;
}
