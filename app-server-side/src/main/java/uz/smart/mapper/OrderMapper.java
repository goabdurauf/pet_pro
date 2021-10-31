package uz.smart.mapper;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;
import uz.smart.dto.OrderDto;
import uz.smart.entity.ClientEntity;
import uz.smart.entity.OrderEntity;
import uz.smart.entity.User;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.payload.ResOrder;
import uz.smart.repository.ClientRepository;
import uz.smart.repository.UserRepository;

import java.util.List;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class OrderMapper {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ClientRepository clientRepository;

    public abstract OrderEntity toEntity(OrderDto dto);

    public abstract OrderEntity updateEntity(OrderDto dto, @MappingTarget OrderEntity entity);

    @InheritInverseConfiguration
    public abstract List<ResOrder> toResOrder(List<OrderEntity> entities);

    public abstract ResOrder toResOrder(OrderEntity entity);

    @AfterMapping
    void toResOrder(@MappingTarget ResOrder res, OrderEntity entity) {
        User manager = userRepository.findById(entity.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "managerId", entity.getManagerId()));
        res.setManagerName(manager.getFullName());

        ClientEntity client = clientRepository.findById(entity.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client", "clientId", entity.getClientId()));
        res.setClientName(client.getName());
    }
}
