package uz.smart.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import uz.smart.dto.AttachmentDto;
import uz.smart.entity.Attachment;
import uz.smart.entity.AttachmentContent;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.AttachmentContentRepository;
import uz.smart.repository.AttachmentRepository;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
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
                String fileName = mpf != null && mpf.getOriginalFilename() != null ? mpf.getOriginalFilename() : "unknown.file";
                String fileType = getFileType(fileName);
                attachment.setName(fileName);
                attachment.setSize(mpf.getSize());
                attachment.setContentType(mpf.getContentType());
                attachment.setDocType(fileType);
                outputStream.close();
                attachment = attachmentRepository.save(attachment);

                AttachmentContent content = new AttachmentContent();
                if ("Rasm".equals(fileType)) {
                    BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(mpf.getBytes()));
                    BufferedImage resizedImage = new BufferedImage(60, 60, BufferedImage.TYPE_INT_RGB);
                    Graphics2D graphics2D = resizedImage.createGraphics();
                    graphics2D.drawImage(originalImage, 0, 0, 60, 60, null);
                    graphics2D.dispose();
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    ImageIO.write(resizedImage, fileName.substring(fileName.lastIndexOf(".") + 1), out);
                    content.setCompressed(out.toByteArray());
                }
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
    public void getFile(HttpServletResponse response, String id, boolean original) {
        try {
            AttachmentContent file = attachmentContentRepository.getByAttachment(attachmentRepository.getOne(UUID.fromString(id)));
            if (file != null) {
                response.setContentType(file.getAttachment().getContentType());
//            response.setHeader("Content-disposition", "attachment; filename=\"" + file.getAttachment().getOriginalName() + "\"");
                FileCopyUtils.copy(original || file.getCompressed() == null ? file.getContent() : file.getCompressed(), response.getOutputStream());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public HttpEntity<?> deleteFile(String id) {
        attachmentContentRepository.deleteByAttachment_Id(UUID.fromString(id));
        attachmentRepository.deleteById(UUID.fromString(id));
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    private String getFileType(String name) {
        if (StringUtils.hasText(name)) {
            String type = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
            return switch (type) {
                case "doc", "docx" -> "Word";
                case "xls", "xlsx" -> "Excel";
                case "pdf" -> "Pdf";
                case "jpg", "jpeg", "png", "bmp" -> "Rasm";
                default -> "Fayl";
            };
        }
        return null;
    }

    public HttpEntity<?> testMethodOne() {
        System.out.println("testMethodOne method start");

        testMethodTwo();

        System.out.println("testMethodOne method end");
        return ResponseEntity.ok().body(new ApiResponse("", true));
    }

    public void testMethodTwo() {
        System.out.println("testMethodTwo method start");
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("testMethodTwo method end");
    }


}
