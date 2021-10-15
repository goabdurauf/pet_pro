package uz.smart.mapper;

import org.mapstruct.*;
import uz.smart.dto.ListDto;
import uz.smart.entity.ListEntity;

import java.util.List;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ListMapper {

    public abstract ListEntity toEntity(ListDto dto);

    public abstract ListEntity updateEntity(@MappingTarget ListEntity entity, ListDto dto);

    @InheritInverseConfiguration
    public abstract List<ListDto> toDto(List<ListEntity> entities);

    public abstract ListDto toDto(ListEntity entity);
}
