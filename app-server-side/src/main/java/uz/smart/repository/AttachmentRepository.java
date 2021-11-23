package uz.smart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.smart.entity.Attachment;

import java.util.List;
import java.util.UUID;


public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {
    List<Attachment> findAllByIdIn(List<UUID> id);
}
