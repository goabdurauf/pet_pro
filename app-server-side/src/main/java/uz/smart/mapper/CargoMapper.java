package uz.smart.mapper;

import org.mapstruct.*;
import uz.smart.dto.AttachmentDto;
import uz.smart.dto.CargoDetailDto;
import uz.smart.dto.CargoDto;
import uz.smart.entity.Attachment;
import uz.smart.entity.CargoDetailEntity;
import uz.smart.entity.CargoEntity;
import uz.smart.payload.ResCargo;

import java.util.List;

/*
    Created by Ilhom Ahmadjonov on 08.11.2021. 
*/

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class CargoMapper {

    public abstract CargoEntity toEntity(CargoDto dto, @MappingTarget CargoEntity entity);

    public abstract CargoDetailEntity toDetailEntity(CargoDetailDto dto, @MappingTarget CargoDetailEntity entity);

    public abstract ResCargo toDto(CargoEntity entity);

    @InheritInverseConfiguration
    public abstract List<CargoDetailDto> toDetailDto(List<CargoDetailEntity> entities);

    public abstract CargoDetailDto toDetailDto(CargoDetailEntity entity);

    @InheritInverseConfiguration
    public abstract List<AttachmentDto> toAttachmentDto(List<Attachment> attachment);

    public abstract AttachmentDto toAttachmentDto(Attachment attachment);

}
