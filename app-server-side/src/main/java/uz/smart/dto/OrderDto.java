package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021. 
*/

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.converter.DateTimeDeserializer;

import java.sql.Timestamp;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class OrderDto {
    private UUID id;
//    private String num;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp date;
    private UUID clientId;
    private UUID managerId;
    private Long statusId;
}
