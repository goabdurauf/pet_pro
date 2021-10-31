package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class CarrierDto {
    private UUID id;
    private String name;
    private String phone;
    private Long countryId;
    private String countryName;
    private String city;
}
