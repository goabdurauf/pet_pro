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
    @Autowired
    CargoService cargoService;

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
        OrderEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "Id", id));
        List<CargoEntity> cargoEntityList = cargoRepository.getAllByOrder_IdAndStateGreaterThanOrderByCreatedAt(id, 0);
        if (cargoEntityList != null && cargoEntityList.size() > 0){
            for (CargoEntity cargoEntity : cargoEntityList) {
                cargoService.deleteCargo(cargoEntity);
            }
        }

        repository.delete(entity);
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

    public List<OrderSelectDto> getOrdersForSelect(ShippingEntity shipping) {
        List<OrderSelectDto> dtoList = new ArrayList<>();
        List<CargoEntity> cargoList = cargoRepository.getAllByShippingIsNullOrderByCreatedAt();

        if (shipping != null && shipping.getCargoEntities() != null && shipping.getCargoEntities().size() > 0){
            cargoList.addAll(shipping.getCargoEntities());
        }

        for (CargoEntity cargoEntity : cargoList) {
            OrderSelectDto selectDto = new OrderSelectDto(cargoEntity.getOrder().getNum(), cargoEntity.getOrder().getId());
            selectDto.setChildren(List.of(new OrderSelectDto(cargoEntity.getNum(), cargoEntity.getId())));
            dtoList.add(selectDto);
        }

        List<OrderSelectDto> result = new ArrayList<>();
        for (OrderSelectDto select : dtoList) {
            boolean isAdd = true;
            for (OrderSelectDto res : result) {
                if (res.getKey().equals(select.getKey())){
                    List<OrderSelectDto> tmp = new ArrayList<>(res.getChildren());
                    tmp.add(select.getChildren().get(0));
                    res.setChildren(tmp);
                    isAdd = false;
                }
            }
            if (isAdd)
                result.add(select);
        }

        return result;
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
