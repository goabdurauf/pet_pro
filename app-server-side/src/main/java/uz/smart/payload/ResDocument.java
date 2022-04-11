package uz.smart.payload;

/*
    Created by Ilhom Ahmadjonov on 30.11.2021. 
*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.smart.dto.AttachmentDto;
import uz.smart.dto.DocumentDto;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class ResDocument extends DocumentDto {
    private String ownerName;
    private String ownerNum;

    public ResDocument(UUID id, UUID ownerId, UUID mainPhotoId, String title, Timestamp date, String comment, List<AttachmentDto> attachments, String ownerName, String ownerNum) {
        super(id, ownerId, mainPhotoId, title, date, comment, attachments);
        this.ownerName = ownerName;
        this.ownerNum = ownerNum;
    }
}
