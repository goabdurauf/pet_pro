package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 17.11.2021. 
*/

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import uz.smart.dto.AttachmentDto;
import uz.smart.dto.DocumentDto;
import uz.smart.entity.Attachment;
import uz.smart.entity.DocumentEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.repository.AttachmentContentRepository;
import uz.smart.repository.AttachmentRepository;
import uz.smart.repository.DocumentRepository;

import java.util.ArrayList;
import java.util.List;

@Service @AllArgsConstructor
public class DocumentService {

    private final DocumentRepository repository;
    private final AttachmentRepository attachmentRepository;
    private final AttachmentContentRepository attachmentContentRepository;

    private final MapperUtil mapper;

    public DocumentEntity saveAndUpdate(DocumentDto dto) {
        DocumentEntity entity = dto.getId() == null
                ? mapper.toDocumentEntity(dto, new DocumentEntity())
                : mapper.toDocumentEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Document", "Id", dto.getId())));

        List<Attachment> docAttachments = new ArrayList<>();
        if (dto.getAttachments() != null) {
            for (AttachmentDto attachmentDto : dto.getAttachments()) {
                docAttachments.add(attachmentRepository.findById(attachmentDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Document", "attachmentId", attachmentDto.getId())));
            }
        }
        entity.setAttachments(docAttachments);
        entity = repository.save(entity);

        return entity;
    }

    public DocumentDto getDocumentDto(DocumentEntity entity) {
        DocumentDto dto = mapper.toDocumentDto(entity);
        dto.setAttachments(mapper.toAttachmentDto(entity.getAttachments()));
        return dto;
    }

    public List<DocumentDto> getDocumentDto(List<DocumentEntity> entities) {
        List<DocumentDto> list = new ArrayList<>();
        if (entities == null)
            return list;

        for (DocumentEntity entity : entities) {
            list.add(getDocumentDto(entity));
        }
        return list;
    }

    public void deleteDocument(DocumentEntity entity) {
        if (entity.getAttachments() != null) {
            for (Attachment attachment : entity.getAttachments()) {
                attachmentContentRepository.deleteByAttachment_Id(attachment.getId());
                attachmentRepository.deleteById(attachment.getId());
            }
        }
        repository.delete(entity);
    }

    public void deleteAllDocuments(List<DocumentEntity> entities) {
        if (entities != null) {
            for (DocumentEntity entity : entities) {
                deleteDocument(entity);
            }
        }
    }
}
