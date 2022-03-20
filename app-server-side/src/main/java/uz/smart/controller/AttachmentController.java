package uz.smart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import uz.smart.dto.AttachmentDto;
import uz.smart.service.AttachmentService;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/file")
public class AttachmentController {
    @Autowired
    private AttachmentService attachmentService;

    @PostMapping
    public AttachmentDto save(MultipartHttpServletRequest request) {
        return attachmentService.saveFile(request);
    }

    @GetMapping("/{id}")
    public void getFile(
            HttpServletResponse response, @PathVariable String id,
            @RequestParam(name = "original", defaultValue = "true", required = false) boolean original
            ) {
        attachmentService.getFile(response, id, original);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable String id) {
        return attachmentService.deleteFile(id);
    }

    @GetMapping("/test")
    public HttpEntity<?> test() {
        return attachmentService.testMethodOne();
    }

}
