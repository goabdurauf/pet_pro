package uz.smart.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "list")
public class ListEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private long typeId;

    private String nameRu;
    private String nameEn;
    private String nameCn;
    private String nameUz;

    private BigDecimal num01;
    private BigDecimal num02;

    private String val01;

    private Timestamp date01;

    private int state = 1;
    private int version = 1;

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    private Timestamp updatedAt;

    @PreUpdate
    private void preUpdate() {version += 1;}

}
