package uz.smart.entity;

/*
    Created by Ilhom Ahmadjonov on 22.04.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.entity.enums.VerificationType;
import uz.smart.entity.template.BaseEntity;

import javax.persistence.Entity;
import java.sql.Timestamp;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name = "verification_act")
public class VerificationActEntity extends BaseEntity {

    private VerificationType type;
    private UUID docId;                 // выписанный счёт, полученный счёт, поступление в кассу, расход из кассы
    private UUID ownerId;               // клиент, перевозчик
    private Long currencyId;
    private Timestamp date;
}
