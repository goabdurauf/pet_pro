package uz.smart.dto;

/*
    Created by Ilhom Ahmadjonov on 17.11.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data @NoArgsConstructor @AllArgsConstructor
public class DocumentDto {
    private UUID id;
    private UUID ownerId;
    private String title;
    private Timestamp date;
    private String comment;

    private List<AttachmentDto> attachments;

    public DocumentDto(UUID id, String title, Timestamp date, String comment) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.comment = comment;
    }
}
