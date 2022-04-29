package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import javax.persistence.Table;
import java.sql.Timestamp;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "orders")
public class OrderEntity extends BaseEntity {
    private String num;
    private Timestamp date;
    private UUID clientId;
    private UUID managerId;
    private Long statusId;
    private String statusName;
}
