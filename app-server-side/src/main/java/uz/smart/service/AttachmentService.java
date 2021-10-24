package uz.smart.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import uz.smart.entity.Attachment;
import uz.smart.entity.AttachmentContent;
import uz.smart.payload.ResUploadFile;
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

    @Transactional
    public ResUploadFile saveFile(MultipartHttpServletRequest request) {
        Iterator<String> itr = request.getFileNames();
        MultipartFile mpf;
        Attachment image = new Attachment();
        ResUploadFile uploadFile = new ResUploadFile();

        while (itr.hasNext()) {
            try {
                mpf = request.getFile(itr.next());
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                image.setName(mpf.getOriginalFilename());
                image.setSize(mpf.getSize());
                image.setContentType(mpf.getContentType());
                outputStream.close();
                image = attachmentRepository.save(image);

                AttachmentContent content = new AttachmentContent();
                content.setContent(mpf.getBytes());
                content.setAttachment(image);
                attachmentContentRepository.save(content);

                uploadFile = new ResUploadFile(image.getId(), image.getName(),
                        ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/file/").path(image.getId().toString()).toUriString(),
                        image.getContentType(), image.getSize());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return uploadFile;
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
}
