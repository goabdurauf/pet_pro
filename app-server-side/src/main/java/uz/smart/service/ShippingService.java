package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.ShippingDto;
import uz.smart.entity.ListEntity;
import uz.smart.entity.ShippingEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.ShippingMapper;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ResShipping;
import uz.smart.repository.ListRepository;
import uz.smart.repository.ShippingRepository;

import java.util.List;
import java.util.UUID;

@Service @AllArgsConstructor
public class ShippingService {

    private ShippingRepository repository;
    private final ListRepository listRepository;
    private final ShippingMapper mapper;

    public HttpEntity<?> saveAndUpdateShipping(ShippingDto dto){
        ShippingEntity entity = dto.getId() == null
                ? mapper.toEntity(dto)
                : mapper.updateEntity(dto, repository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", dto.getId())));

        ListEntity currency = listRepository.findById(dto.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
        entity.setCurrencyName(currency.getNameRu());

        ListEntity shType = listRepository.findById(dto.getShippingTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "shippingTypeId", dto.getShippingTypeId()));
        entity.setShippingTypeName(shType.getNameRu());

        repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteShipping(UUID id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public ShippingDto getShipping(UUID id) {
        return mapper.toDto(repository.getShippingById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", id)));
    }

    public List<ResShipping> getShippingList() {return mapper.toResShipping(repository.getAllShipping());}
}
