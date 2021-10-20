package uz.smart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@Data @NoArgsConstructor @AllArgsConstructor
public class ListDto {
    private Long id;

    private long typeId;

    @NotBlank
    private String nameRu;
    private String nameEn;
    private String nameCn;
    private String nameUz;
}
