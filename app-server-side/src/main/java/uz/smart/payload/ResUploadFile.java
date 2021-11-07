package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class ResUploadFile {
    private UUID id;
    private String name;
    private String url;
    private String type;
    private long size;
}
