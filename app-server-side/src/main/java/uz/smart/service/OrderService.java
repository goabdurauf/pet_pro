package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.OrderDto;
import uz.smart.dto.OrderSelectDto;
import uz.smart.entity.*;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ReqSearch;
import uz.smart.payload.ResOrder;
import uz.smart.payload.ResPageable;
import uz.smart.repository.*;
import uz.smart.utils.CommonUtils;

import java.util.*;

@Service
public class OrderService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    OrderRepository repository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    CargoRepository cargoRepository;
    @Autowired
    ShippingRepository shippingRepository;
    @Autowired
    MapperUtil mapper;
    @Autowired
    ShippingService shippingService;

    public HttpEntity<?> saveAndUpdate(OrderDto dto){
        OrderEntity entity = dto.getId() == null
                ? mapper.toOrderEntity(dto)
                : mapper.updateOrderEntity(dto, repository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "Id", dto.getId())));

        if (dto.getId() == null){
            Optional<OrderEntity> opt = repository.getFirstByOrderByCreatedAtDesc();
            if (opt.isEmpty())
                entity.setNum(CommonUtils.generateNextNum("Z", ""));
            else
                entity.setNum(CommonUtils.generateNextNum("Z", opt.get().getNum()));
        }

        ListEntity status = listRepository.findById(dto.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getStatusId()));
        entity.setStatusName(status.getNameRu());

        entity = repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse(entity.getId().toString(), true));
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
        List<OrderSelectDto> dtoList = new ArrayList<>();
        for (OrderEntity order : page.getContent()) {
            OrderSelectDto dto = new OrderSelectDto(order.getNum(), order.getId(), order.getId());
            List<CargoEntity> cargoList = cargoRepository.getAllByOrder_IdAndStateGreaterThanOrderByCreatedAt(order.getId(), 0);
            if (cargoList.size() > 0) {
                List<OrderSelectDto> childList = new ArrayList<>();
                for (CargoEntity cargo : cargoList) {
                    childList.add(new OrderSelectDto(cargo.getNum(), cargo.getId(), cargo.getId()));
                }
                dto.setChildren(childList);
                dtoList.add(dto);
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ResPageable(dtoList, 0, 0));
    }

    private List<ResOrder> getResOrderList(List<OrderEntity> entities, boolean hasDetail) {
        List<ResOrder> resList = new ArrayList<>();
        for (OrderEntity entity : entities) {
            resList.add(getResOrder(entity, hasDetail));
        }
        return resList;
    }

    public ResOrder getResOrder(OrderEntity entity, boolean hasDetails) {
        ResOrder resOrder = mapper.toResOrder(entity);
        if (hasDetails) {
            User manager = userRepository.findById(entity.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "managerId", entity.getManagerId()));
            resOrder.setManagerName(manager.getFullName());

            ClientEntity client = clientRepository.findById(entity.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client", "clientId", entity.getClientId()));
            resOrder.setClientName(client.getName());
            List<ShippingEntity> shippingList = shippingRepository.getAllByOrderEntitiesInAndStateGreaterThan(List.of(entity), 0);
            resOrder.setShippingList(shippingService.getShippingList(shippingList, false));
        }
        return resOrder;
    }

}
