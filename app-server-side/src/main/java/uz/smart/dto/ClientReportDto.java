package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 18.04.2022. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class ClientReportDto {
    private long okb;
    private long akb;
    private long days;
}
