package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 02.01.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.KassaDto;
import uz.smart.entity.KassaEntity;
import uz.smart.entity.ListEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.KassaRepository;
import uz.smart.repository.ListRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class KassaService {

    @Autowired
    KassaRepository repository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    MapperUtil mapperUtil;

    public HttpEntity<?> saveAndUpdate(KassaDto dto) {
        KassaEntity entity = dto.getId() == null
                ? mapperUtil.toKassaEntity(dto, new KassaEntity())
                : mapperUtil.toKassaEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Kassa", "Id", dto.getId())));
        if (dto.getCurrencyId() != null) {
            ListEntity currency = listRepository.findById(dto.getCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
            entity.setCurrencyName(currency.getNameRu());
        }
        repository.save(entity);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public KassaDto getById(UUID id) {
        return getDto(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kassa", "Id", id)));
    }

    public KassaDto getDto(KassaEntity entity) {
        KassaDto dto = mapperUtil.toKassaDto(entity);
        dto.setBalans(entity.getBalance());

        return dto;
    }

    public List<KassaDto> getKassaList() {
        List<KassaDto> list = new ArrayList<>();
        List<KassaEntity> entityList = repository.findAllByStateGreaterThanOrderByCreatedAtDesc(0);
        if (entityList.size() == 0)
            return list;

        for (KassaEntity entity : entityList) {
            list.add(getDto(entity));
        }

        return list;
    }

    public HttpEntity<?> delete(UUID id) {
        repository.updateById(id);

        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

}
