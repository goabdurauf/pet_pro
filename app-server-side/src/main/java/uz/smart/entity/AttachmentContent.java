package uz.smart.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.smart.entity.template.AbsEntity;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToOne;


@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
@Entity(name="AttachmentContent")
public class AttachmentContent extends AbsEntity {

    private byte[] content;
    private byte[] compressed;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    private Attachment attachment;

    public AttachmentContent(byte[] content, Attachment attachment) {
        this.content = content;
        this.attachment = attachment;
    }
}
