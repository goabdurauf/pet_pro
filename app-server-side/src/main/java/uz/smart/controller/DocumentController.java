package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 17.11.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import uz.smart.dto.AttachmentDto;
import uz.smart.dto.DocumentDto;
import uz.smart.service.DocumentService;

import java.util.UUID;

@RestController
@RequestMapping("/api/document")
public class DocumentController {

    @Autowired
    DocumentService service;

    @GetMapping("/{id}")
    public DocumentDto get(@PathVariable UUID id) {
        return service.getDocumentDto(id);
    }

    @PostMapping("/{id}/attachment")
    public AttachmentDto addAttachment(@PathVariable UUID id, MultipartHttpServletRequest request) {
        return service.addAttachment(id, request);
    }

    @DeleteMapping("/{docId}/attachment/{attachmentId}")
    public HttpEntity<?> deleteDocumentAttachment(@PathVariable UUID docId, @PathVariable UUID attachmentId) {
        return service.deleteAttachment(docId, attachmentId);
    }
}
