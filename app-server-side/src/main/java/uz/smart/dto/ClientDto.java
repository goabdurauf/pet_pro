package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ClientDto {
    private UUID id;
    private String name;
    private String contactPerson;
    private String phone;
    private long countryId;
    private String countryName;
    private String city;
    private UUID managerId;
    private String managerName;
    private Long aboutId;
    private String aboutName;
    private Long lastOrder;
}
