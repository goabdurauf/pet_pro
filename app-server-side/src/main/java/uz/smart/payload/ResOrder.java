package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResOrder {
    private UUID id;
    private String num;
    @JsonFormat(pattern = "dd.MM.yyyy HH:mm:ss")
    private Date date;
    private UUID clientId;
    private String clientName;
    private UUID managerId;
    private String managerName;
    private Long statusId;
    private String statusName;
    private List<ResShipping> shippingList;

    public ResOrder(UUID id, String num) {
        this.id = id;
        this.num = num;
    }
}
