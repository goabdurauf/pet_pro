package uz.smart.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.ProductDto;
import uz.smart.entity.ListEntity;
import uz.smart.entity.ProductEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.ListRepository;
import uz.smart.repository.ProductRepository;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ProductService {

    private final ProductRepository repository;
    private final ListRepository listRepository;
    private final MapperUtil mapperUtil;

    public HttpEntity<?> saveAndUpdateProduct(ProductDto dto) {
        ProductEntity entity = dto.getId() == null
                ? mapperUtil.toProductEntity(dto)
                : mapperUtil.updateProductEntity(dto, repository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "Id", dto.getId())));

        ListEntity listEntity = listRepository.findById(dto.getMeasureId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "measureId", dto.getMeasureId()));
        entity.setMeasureName(listEntity.getNameRu());

        repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteItem(UUID id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public ProductDto getProduct(UUID id) {
        return mapperUtil.toProductDto(repository.getProductById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "Id", id)));
    }

    public List<ProductDto> getAllProducts() {
        return mapperUtil.toProductDto(repository.getProductList());
    }
}
