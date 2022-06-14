package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import lombok.*;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import java.sql.Timestamp;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "orders")
public class OrderEntity extends BaseEntity {
  private String num;
  private Timestamp date;
  private UUID clientId;
  private UUID managerId;
  private Long statusId;
  private String statusName;
}
