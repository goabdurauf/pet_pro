package uz.smart.mapper;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import uz.smart.dto.*;
import uz.smart.entity.*;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.repository.UserRepository;

import java.util.List;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class MapperUtil {

    @Autowired
    private UserRepository userRepository;

    // list items
    public abstract ListEntity toListEntity(ListDto dto);
    public abstract ListEntity updateListEntity(ListDto dto, @MappingTarget ListEntity entity);
    @InheritInverseConfiguration
    public abstract List<ListDto> toListDto(List<ListEntity> entities);
    public abstract ListDto toListDto(ListEntity entity);

    // product
    public abstract ProductEntity toProductEntity(ProductDto dto);
    public abstract ProductEntity updateProductEntity(ProductDto dto, @MappingTarget ProductEntity entity);
    @InheritInverseConfiguration
    public abstract List<ProductDto> toProductDto(List<ProductEntity> entities);
    public abstract ProductDto toProductDto(ProductEntity entity);
    /*@AfterMapping
    void toProductDto(@MappingTarget ProductDto dto, ProductEntity entity) {
        ListEntity listEntity = listRepository.findById(entity.getMeasureId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "measureId", entity.getMeasureId()));
        dto.setMeasureName(listEntity.getNameRu());
    }*/

    // clients
    public abstract ClientEntity toClientEntity(ClientDto dto);
    public abstract ClientEntity updateClientEntity(ClientDto dto, @MappingTarget ClientEntity entity);
    @InheritInverseConfiguration
    public abstract List<ClientDto> toClientDto(List<ClientEntity> entities);
    public abstract ClientDto toClientDto(ClientEntity entity);
    @AfterMapping
    void toClientDto(@MappingTarget ClientDto dto, ClientEntity entity) {
        if (entity.getManagerId() != null) {
            User manager = userRepository.findById(entity.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "role", entity.getManagerId()));
            dto.setManagerName(manager.getFullName());
        }
    }

    // suppliers
    public abstract SupplierEntity toSupplierEntity(SupplierDto dto);
    public abstract SupplierEntity updateSupplierEntity(SupplierDto dto, @MappingTarget SupplierEntity entity);
    @InheritInverseConfiguration
    public abstract List<SupplierDto> toSupplierDto(List<SupplierEntity> entities);
    public abstract SupplierDto toSupplierDto(SupplierEntity entity);
    @AfterMapping
    void toSupplierDto(@MappingTarget SupplierDto dto, SupplierEntity entity) {
        if (entity.getManagerId() != null) {
            User manager = userRepository.findById(entity.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "role", entity.getManagerId()));
            dto.setManagerName(manager.getFullName());
        }
    }

    // carrier
    public abstract CarrierEntity toCarrierEntity(CarrierDto dto);
    public abstract CarrierEntity updateCarrierEntity(CarrierDto dto, @MappingTarget CarrierEntity entity);
    @InheritInverseConfiguration
    public abstract List<CarrierDto> toCarrierDto(List<CarrierEntity> entities);
    public abstract CarrierDto toCarrierDto(CarrierEntity entity);
    @AfterMapping
    void toCarrierDto(@MappingTarget CarrierDto dto, CarrierEntity entity) {
        if (entity.getManagerId() != null) {
            User manager = userRepository.findById(entity.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "role", entity.getManagerId()));
            dto.setManagerName(manager.getFullName());
        }
    }

}
