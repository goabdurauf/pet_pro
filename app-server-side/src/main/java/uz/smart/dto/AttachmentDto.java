package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class AttachmentDto {
    private UUID id;
    private String name;
}
