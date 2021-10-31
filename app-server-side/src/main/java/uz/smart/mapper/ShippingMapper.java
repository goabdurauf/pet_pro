package uz.smart.mapper;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import uz.smart.dto.ShippingDto;
import uz.smart.entity.CarrierEntity;
import uz.smart.entity.ShippingEntity;
import uz.smart.entity.User;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.payload.ResShipping;
import uz.smart.repository.CarrierRepository;
import uz.smart.repository.UserRepository;

import java.util.List;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class ShippingMapper {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CarrierRepository carrierRepository;

    public abstract ShippingEntity toEntity(ShippingDto dto);

    public abstract ShippingEntity updateEntity(ShippingDto dto, @MappingTarget ShippingEntity entity);

    public abstract ShippingDto toDto(ShippingEntity entity);

    @InheritInverseConfiguration
    public abstract List<ResShipping> toResShipping(List<ShippingEntity> entities);

    public abstract ResShipping toResShipping(ShippingEntity entity);

    @AfterMapping
    void toResShipping(@MappingTarget ResShipping res, ShippingEntity entity) {
        User manager = userRepository.findById(entity.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "managerId", entity.getManagerId()));
        res.setManagerName(manager.getFullName());

        CarrierEntity carrier = carrierRepository.findById(entity.getCarrierId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrier", "carrierId", entity.getCarrierId()));
        res.setCarrierName(carrier.getName());
    }


}
