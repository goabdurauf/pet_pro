package uz.smart.mapper;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import uz.smart.dto.*;
import uz.smart.entity.*;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.payload.ResCargo;
import uz.smart.payload.ResInvoice;
import uz.smart.payload.ResOrder;
import uz.smart.payload.ResShipping;
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

    // shipping
    public abstract ShippingEntity toShippingEntity(ShippingDto dto);

    public abstract ShippingEntity updateShippingEntity(ShippingDto dto, @MappingTarget ShippingEntity entity);

    public abstract ShippingDto toShippingDto(ShippingEntity entity);

    @InheritInverseConfiguration
    public abstract List<ResShipping> toResShipping(List<ShippingEntity> entities);

    public abstract ResShipping toResShipping(ShippingEntity entity);

    // order
    public abstract OrderEntity toOrderEntity(OrderDto dto);

    public abstract OrderEntity updateOrderEntity(OrderDto dto, @MappingTarget OrderEntity entity);

    @InheritInverseConfiguration
    public abstract List<ResOrder> toResOrder(List<OrderEntity> entities);

    public abstract ResOrder toResOrder(OrderEntity entity);

    // cargo
    public abstract CargoEntity toCargoEntity(CargoDto dto, @MappingTarget CargoEntity entity);

    public abstract CargoDetailEntity toCargoDetailEntity(CargoDetailDto dto, @MappingTarget CargoDetailEntity entity);

    public abstract ResCargo toResCargo(CargoEntity entity);

    @InheritInverseConfiguration
    public abstract List<CargoDetailDto> toCargoDetailDto(List<CargoDetailEntity> entities);

    public abstract CargoDetailDto toCargoDetailDto(CargoDetailEntity entity);

    // attachment
    @InheritInverseConfiguration
    public abstract List<AttachmentDto> toAttachmentDto(List<Attachment> attachment);

    public abstract AttachmentDto toAttachmentDto(Attachment attachment);

    @AfterMapping
    void afterToAttachmentDto(@MappingTarget AttachmentDto dto, Attachment entity) {
        dto.setType(entity.getContentType());
        dto.setUrl(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/file/").path(entity.getId().toString()).toUriString());
    }

    // document
    public abstract DocumentEntity toDocumentEntity(DocumentDto dto, @MappingTarget DocumentEntity entity);

    public abstract DocumentDto toDocumentDto(DocumentEntity entity);

    // Expense
    public abstract ExpenseEntity toExpenseEntity(ExpenseDto dto, @MappingTarget ExpenseEntity entity);

    public abstract ExpenseDto toExpenseDto(ExpenseEntity entity);

    public abstract ExpenseEntity cloneExpense(ExpenseEntity entity);

    @AfterMapping
    void cloneExpense(@MappingTarget ExpenseEntity entity, ExpenseEntity old) {
        entity.setId(null);
        entity.setVersion(1);
        entity.setCreatedAt(null);
        entity.setUpdatedAt(null);
    }

    // Received Invoice
    @InheritInverseConfiguration
    public abstract List<ResInvoice> toResInvoice(List<InvoiceEntity> entities);

    public abstract InvoiceEntity toInvoiceEntity(InvoiceDto dto, @MappingTarget InvoiceEntity entity);

    public abstract ResInvoice toResInvoice(InvoiceEntity entity);

    // Transactions
    public abstract TransactionsEntity toTransactionsEntity(TransactionsDto dto, @MappingTarget TransactionsEntity entity);

    public abstract TransactionsDto toTransactionDto(TransactionsEntity entity);

    // Kassa
    public abstract KassaEntity toKassaEntity(KassaDto dto, @MappingTarget KassaEntity entity);

    public abstract KassaDto toKassaDto(KassaEntity entity);

}
