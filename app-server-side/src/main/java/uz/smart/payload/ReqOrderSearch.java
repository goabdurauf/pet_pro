package uz.smart.payload;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

/*
    Created by Ilhom Ahmadjonov on 29.04.2022. 
*/

@EqualsAndHashCode(callSuper = true)
@Data
public class ReqOrderSearch extends ReqSearch {
    private String num = "";
    private UUID clientId;
    private UUID managerId;
    private Long statusId;
}
