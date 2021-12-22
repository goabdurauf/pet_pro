package uz.smart.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.smart.converter.DateTimeDeserializer;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Data @NoArgsConstructor @AllArgsConstructor
public class ListDto {
    private Long id;

    private long typeId;

    @NotBlank
    private String nameRu;
    private String nameEn;
    private String nameCn;
    private String nameUz;

    private BigDecimal num01;
    private BigDecimal num02;

    private String val01;

    @JsonDeserialize(using = DateTimeDeserializer.class)
    private Timestamp date01;

}
