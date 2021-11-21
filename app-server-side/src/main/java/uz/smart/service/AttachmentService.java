package uz.smart.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import uz.smart.dto.AttachmentDto;
import uz.smart.entity.Attachment;
import uz.smart.entity.AttachmentContent;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.AttachmentContentRepository;
import uz.smart.repository.AttachmentRepository;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentContentRepository attachmentContentRepository;
    private final AttachmentRepository attachmentRepository;

    private final MapperUtil mapperUtil;

    @Transactional
    public AttachmentDto saveFile(MultipartHttpServletRequest request) {
        Iterator<String> itr = request.getFileNames();
        MultipartFile mpf;
        Attachment attachment = new Attachment();

        while (itr.hasNext()) {
            try {
                mpf = request.getFile(itr.next());
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                attachment.setName(mpf.getOriginalFilename());
                attachment.setSize(mpf.getSize());
                attachment.setContentType(mpf.getContentType());
                outputStream.close();
                attachment = attachmentRepository.save(attachment);

                AttachmentContent content = new AttachmentContent();
                content.setContent(mpf.getBytes());
                content.setAttachment(attachment);
                attachmentContentRepository.save(content);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return mapperUtil.toAttachmentDto(attachment);
    }

    @Transactional(readOnly = true, propagation = Propagation.SUPPORTS)
    public void getFile(HttpServletResponse response, String id) {
        try {
            AttachmentContent file = attachmentContentRepository.getByAttachment(attachmentRepository.getOne(UUID.fromString(id)));
            response.setContentType(file.getAttachment().getContentType());
//            response.setHeader("Content-disposition", "attachment; filename=\"" + file.getAttachment().getOriginalName() + "\"");
            FileCopyUtils.copy(file.getContent(), response.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public HttpEntity<?> deleteFile(String id) {
        attachmentContentRepository.deleteByAttachment_Id(UUID.fromString(id));
        attachmentRepository.deleteById(UUID.fromString(id));
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }
}
