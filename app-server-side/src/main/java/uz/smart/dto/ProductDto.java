package uz.smart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ProductDto {
    private UUID id;

    @NotBlank
    private String name;
    private String code;
    private long measureId;
    private String measureName;

    private List<AttachmentDto> attachments;
}
