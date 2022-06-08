package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.OrderDto;
import uz.smart.dto.OrderSelectDto;
import uz.smart.entity.*;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ReqOrderSearch;
import uz.smart.payload.ResOrder;
import uz.smart.payload.ResPageable;
import uz.smart.repository.*;
import uz.smart.utils.AppConstants;
import uz.smart.utils.CommonUtils;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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

    private final SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");

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

//        ListEntity status = listRepository.findById(dto.getStatusId())
//                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getStatusId()));
//        entity.setStatusName(status.getNameRu());

        entity = repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse(entity.getId().toString(), true));
    }

    public HttpEntity<?> deleteOrder(UUID id) {
        OrderEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "Id", id));
        List<CargoEntity> cargoEntityList = cargoRepository.getAllByOrder_IdAndStateOrderByCreatedAt(id, 1);
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

    public HttpEntity<?> getOrderList(ReqOrderSearch req) {
        Page<OrderEntity> page = null;
        try {
            page = repository.getOrdersByFilter(
                    req.getNum(),
                    new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
                    new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.END_DATE).getTime()),
                    req.getClientId(), req.getManagerId(), req.getStatusId(),
                    CommonUtils.getPageable(req.getPage(), req.getSize()));
        } catch (ParseException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ResPageable<>(new ArrayList<>(), 0, req.getPage()));
        }
        return ResponseEntity.ok(new ResPageable<>(getResOrderList(page.getContent(), true), page.getTotalElements(), req.getPage()));
    }

    public List<OrderSelectDto> getOrdersForSelect(ShippingEntity shipping) {
        List<OrderSelectDto> dtoList = new ArrayList<>();
        List<CargoEntity> cargoList = cargoRepository.getAllByShippingIsNullOrderByCreatedAt();

        if (shipping != null && shipping.getCargoEntities() != null && shipping.getCargoEntities().size() > 0){
            cargoList.addAll(shipping.getCargoEntities());
        }

        for (CargoEntity cargoEntity : cargoList) {
            OrderSelectDto selectDto = new OrderSelectDto(cargoEntity.getOrder().getNum(), cargoEntity.getOrder().getId());
            selectDto.setChildren(List.of(new OrderSelectDto(cargoEntity.getNum() + " - " + cargoEntity.getName(), cargoEntity.getId())));
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

            ListEntity status = listRepository.findById(entity.getStatusId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "statusId", entity.getStatusId()));
            resOrder.setStatusName(status.getNameRu());
            resOrder.setStatusColor(status.getVal01());

            List<ShippingEntity> shippingList = shippingRepository.getAllByOrderEntitiesInAndStateGreaterThan(List.of(entity), 0);
            resOrder.setShippingList(shippingService.getShippingList(shippingList, false));
        }
        return resOrder;
    }

    public ResPageable<List<ResOrder>> getOrderReport(ReqOrderSearch req) {
        Page<OrderEntity> page;
        try {
            page = repository.getOrdersByFilter(
                    req.getNum(),
                    new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
                    new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.END_DATE).getTime()),
                    req.getClientId(), req.getManagerId(), req.getStatusId(),
                    CommonUtils.getPageable(req.getPage(), req.getSize()));
        } catch (ParseException e) {
            e.printStackTrace();
            return new ResPageable<>(new ArrayList<>(), 0, req.getPage());
        }
        return new ResPageable<>(getResOrderList(page.getContent(), true), page.getTotalElements(), req.getPage());
    }

}
