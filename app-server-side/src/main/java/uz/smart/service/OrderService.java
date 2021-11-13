package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.OrderDto;
import uz.smart.entity.ClientEntity;
import uz.smart.entity.ListEntity;
import uz.smart.entity.OrderEntity;
import uz.smart.entity.User;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.OrderMapper;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ReqSearch;
import uz.smart.payload.ResOrder;
import uz.smart.payload.ResPageable;
import uz.smart.repository.ClientRepository;
import uz.smart.repository.ListRepository;
import uz.smart.repository.OrderRepository;
import uz.smart.repository.UserRepository;
import uz.smart.utils.CommonUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service @AllArgsConstructor
public class OrderService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final OrderRepository repository;
    private final ListRepository listRepository;
    private final OrderMapper mapper;

    public HttpEntity<?> saveAndUpdate(OrderDto dto){
        OrderEntity entity = dto.getId() == null
                ? mapper.toEntity(dto)
                : mapper.updateEntity(dto, repository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "Id", dto.getId())));

        ListEntity status = listRepository.findById(dto.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getStatusId()));
        entity.setStatusName(status.getNameRu());

        repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteOrder(UUID id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public ResOrder getOrder(UUID id, boolean hasDetail) {
        return getResOrder(repository.getOrderById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id)), hasDetail);
    }

    public HttpEntity<?> getOrderList(ReqSearch req) {
        Page<OrderEntity> page = repository.getAllOrders(CommonUtils.getPageable(req.getPage(), req.getSize()));
        return ResponseEntity.status(HttpStatus.OK).body(new ResPageable(getResOrderList(page.getContent(), true), page.getTotalElements(), req.getPage()));
    }

    public HttpEntity<?> getOrdersForSelect() {
        Page<OrderEntity> page = repository.getAllOrders(CommonUtils.getPageable(0, 15));
        return ResponseEntity.status(HttpStatus.OK).body(new ResPageable(getResOrderList(page.getContent(), false), 0, 0));
    }

    private List<ResOrder> getResOrderList(List<OrderEntity> entities, boolean hasDetail) {
        List<ResOrder> resList = new ArrayList<>();
        for (OrderEntity entity : entities) {
            resList.add(getResOrder(entity, hasDetail));
        }
        return resList;
    }
    private ResOrder getResOrder(OrderEntity entity, boolean hasDetails) {
        ResOrder resOrder = mapper.toResOrder(entity);
        if (hasDetails) {
            User manager = userRepository.findById(entity.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "managerId", entity.getManagerId()));
            resOrder.setManagerName(manager.getFullName());

            ClientEntity client = clientRepository.findById(entity.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client", "clientId", entity.getClientId()));
            resOrder.setClientName(client.getName());
        }
        return resOrder;
    }
}
