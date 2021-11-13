package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.ShippingDto;
import uz.smart.entity.*;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.ShippingMapper;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ResShipping;
import uz.smart.repository.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service @AllArgsConstructor
public class ShippingService {

    private final UserRepository userRepository;
    private final CarrierRepository carrierRepository;
    private final OrderRepository orderRepository;
    private final ShippingRepository repository;
    private final ListRepository listRepository;
    private final ClientRepository clientRepository;
    private final ShippingMapper mapper;

    public HttpEntity<?> saveAndUpdateShipping(ShippingDto dto){
        ShippingEntity entity = dto.getId() == null
                ? mapper.toEntity(dto)
                : mapper.updateEntity(dto, repository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", dto.getId())));

        ListEntity currency = listRepository.findById(dto.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
        entity.setCurrencyName(currency.getNameRu());

        ListEntity shType = listRepository.findById(dto.getShippingTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "shippingTypeId", dto.getShippingTypeId()));
        entity.setShippingTypeName(shType.getNameRu());

        repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteShipping(UUID id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public ShippingDto getShipping(UUID id) {
        return mapper.toDto(repository.getShippingById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", id)));
    }

    public List<ResShipping> getShippingListByOrderId(UUID id) {
        return getShippingList(repository.getAllByOrderIdAndStateGreaterThan(id, 0));
    }

    public List<ResShipping> getShippingList() {
        List<ShippingEntity> entityList = repository.getAllShipping();
        return getShippingList(entityList);
    }

    private List<ResShipping> getShippingList(List<ShippingEntity> entityList) {
        List<ResShipping> list = new ArrayList<>();
        for (ShippingEntity entity : entityList) {
            list.add(getResShipping(entity));
        }
        return list;
    }

    public ResShipping getResShipping(UUID id) {
        return getResShipping(repository.getShippingById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", id)));
    }

    private ResShipping getResShipping(ShippingEntity entity) {
        ResShipping res = mapper.toResShipping(entity);
        User manager = userRepository.findById(entity.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "managerId", entity.getManagerId()));
        res.setManagerName(manager.getFullName());

        CarrierEntity carrier = carrierRepository.findById(entity.getCarrierId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrier", "carrierId", entity.getCarrierId()));
        res.setCarrierName(carrier.getName());

        OrderEntity order = orderRepository.findById(entity.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", entity.getOrderId()));
        res.setOrderNum(order.getNum());

        ClientEntity client = clientRepository.findById(order.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "clientId", order.getClientId()));
        res.setClientName(client.getName());

        return res;
    }
}
