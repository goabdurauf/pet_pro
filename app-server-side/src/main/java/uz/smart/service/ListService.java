package uz.smart.service;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.ListDto;
import uz.smart.entity.ListEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.ListRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class ListService {

    private final MapperUtil mapper;
    private final ListRepository repository;

    public HttpEntity<?> saveAndUpdateListItem(ListDto dto) {
        ListEntity entity = dto.getId() == null
                ? mapper.toListEntity(dto)
                : mapper.updateListEntity(dto, repository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("List with type " + dto.getTypeId(), "Id", dto.getId())));

        repository.save(entity);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteItem(long id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public ListDto getItem(long id){
        ListEntity entity = repository.getListItemWithId(id)
                    .orElseThrow(() -> new ResourceNotFoundException("List", "Id", id));
        return mapper.toListDto(entity);
    }

    public List<ListDto> getItems(long type) {
        List<ListEntity> entities = repository.getListByType(type);
        return mapper.toListDto(entities);
    }
}
