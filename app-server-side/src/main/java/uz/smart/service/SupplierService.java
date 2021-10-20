package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021. 
*/

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.SupplierDto;
import uz.smart.entity.ListEntity;
import uz.smart.entity.SupplierEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.ListRepository;
import uz.smart.repository.SupplierRepository;

import java.util.List;
import java.util.UUID;

@Service @AllArgsConstructor
public class SupplierService {

    private final SupplierRepository repository;
    private final ListRepository listRepository;
    private final MapperUtil mapperUtil;

    public HttpEntity<?> saveAndUpdate(SupplierDto dto) {
        SupplierEntity entity = dto.getId() == null
                ? mapperUtil.toSupplierEntity(dto)
                : mapperUtil.updateSupplierEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "Id", dto.getId())));

        ListEntity listEntity = listRepository.findById(dto.getCountryId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "countryId", dto.getCountryId()));
        entity.setCountryName(listEntity.getNameRu());

        repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteSupplier(UUID id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public SupplierDto getSupplier(UUID id) {
        return mapperUtil.toSupplierDto(repository.getSupplierById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id)));
    }

    public List<SupplierDto> getSupplierList() {
        return mapperUtil.toSupplierDto(repository.getAllSuppliers());
    }
}
