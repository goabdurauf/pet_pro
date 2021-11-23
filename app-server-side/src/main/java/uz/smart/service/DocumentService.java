package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 17.11.2021. 
*/

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartHttpServletRequest;
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
import java.util.UUID;

@Service @AllArgsConstructor
public class DocumentService {

    private final DocumentRepository repository;
    private final AttachmentRepository attachmentRepository;
    private final AttachmentContentRepository attachmentContentRepository;

    private final AttachmentService attachmentService;

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

    public DocumentDto getDocumentDto(UUID id) {
        return getDocumentDto(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "Id", id)));
    }

    public DocumentDto getDocumentDto(DocumentEntity entity) {
        if (entity != null) {
            DocumentDto dto = mapper.toDocumentDto(entity);
            if (entity.getAttachments() != null)
                dto.setAttachments(mapper.toAttachmentDto(entity.getAttachments()));

            return dto;
        } else
            return null;
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

    public AttachmentDto addAttachment(UUID id, MultipartHttpServletRequest request) {
        DocumentEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "Id", id));
        AttachmentDto attachmentDto = attachmentService.saveFile(request);
        Attachment attachment = attachmentRepository.findById(attachmentDto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Document", "attachmentId", attachmentDto.getId()));
        List<Attachment> docAttachments = new ArrayList<>();
        if (entity.getAttachments() != null)
            docAttachments = entity.getAttachments();

        docAttachments.add(attachment);
        repository.saveAndFlush(entity);

        return attachmentDto;
    }

    public void deleteDocument(DocumentEntity entity) {
        if (entity.getAttachments() != null) {
           for (Attachment attachment : entity.getAttachments()) {
                attachmentContentRepository.deleteByAttachment_Id(attachment.getId());
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

    public HttpEntity<?> deleteAttachment(UUID docId, UUID attachmentId) {
        DocumentEntity entity = repository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "Id", docId));
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "attachmentId", attachmentId));

        entity.getAttachments().remove(attachment);
        entity = repository.saveAndFlush(entity);

        attachmentContentRepository.deleteByAttachment_Id(attachmentId);
        attachmentRepository.delete(attachment);

        return ResponseEntity.ok("Удалено!");
    }
}
