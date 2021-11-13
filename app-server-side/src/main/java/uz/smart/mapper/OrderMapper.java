package uz.smart.mapper;

import org.mapstruct.*;
import uz.smart.dto.OrderDto;
import uz.smart.entity.OrderEntity;
import uz.smart.payload.ResOrder;

import java.util.List;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class OrderMapper {

    public abstract OrderEntity toEntity(OrderDto dto);

    public abstract OrderEntity updateEntity(OrderDto dto, @MappingTarget OrderEntity entity);

    @InheritInverseConfiguration
    public abstract List<ResOrder> toResOrder(List<OrderEntity> entities);

    public abstract ResOrder toResOrder(OrderEntity entity);

}
