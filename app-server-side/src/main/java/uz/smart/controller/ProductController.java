package uz.smart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.ProductDto;
import uz.smart.service.ProductService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    ProductService service;

    @PostMapping("/save")
    public HttpEntity<?> save(@RequestBody ProductDto dto) {
        return service.saveAndUpdateProduct(dto);
    }

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) {
        return service.deleteItem(id);
    }

    @GetMapping("/{id}")
    public ProductDto get(@PathVariable UUID id) {
        return service.getProduct(id);
    }

    @GetMapping("/list")
    public List<ProductDto> getList() {
        return service.getAllProducts();
    }
}
