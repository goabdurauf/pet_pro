package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 14.11.2021.
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class OrderSelectDto {
    private String  title;
    private UUID value;
    private UUID key;
    private List<OrderSelectDto> children;

    public OrderSelectDto(String title, UUID value, UUID key) {
        this.title = title;
        this.value = value;
        this.key = key;
    }
}
