package uz.smart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.Attachment;

import java.util.UUID;


public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {
}
