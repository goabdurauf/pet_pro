package uz.smart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.Attachment;
import uz.smart.entity.AttachmentContent;

import java.util.Optional;
import java.util.UUID;

public interface AttachmentContentRepository extends JpaRepository<AttachmentContent, UUID> {

    AttachmentContent getByAttachment(Attachment attachment);
    Optional<AttachmentContent> findByAttachment(Attachment attachment);
}
