package uz.smart.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.ListDto;
import uz.smart.entity.ListEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.ListMapper;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.ListRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class ListService {

    private final ListMapper mapper;
    private final ListRepository repository;

    public HttpEntity<?> saveList(ListDto dto) {
        repository.save(mapper.toEntity(dto));
        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> updateList(ListDto dto) {
        ListEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("List with type " + dto.getTypeId(), "Id", dto.getId()));
        repository.save(mapper.updateEntity(entity, dto));
        return ResponseEntity.ok().body(new ApiResponse("Изменено успешно", true));
    }

    public ListDto getItem(long id){
        ListEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("List", "Id", id));
        return mapper.toDto(entity);
    }

    public List<ListDto> getItems(long type) {
        List<ListEntity> entities = repository.getListByType(type);
        return mapper.toDto(entities);
    }
}
