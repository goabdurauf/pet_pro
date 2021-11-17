package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.DocumentDto;
import uz.smart.dto.ShippingDto;
import uz.smart.entity.*;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ResCargo;
import uz.smart.payload.ResOrder;
import uz.smart.payload.ResShipping;
import uz.smart.repository.*;
import uz.smart.utils.CommonUtils;

import java.util.*;

@Service @AllArgsConstructor
public class ShippingService {

    private final UserRepository userRepository;
    private final CarrierRepository carrierRepository;
    private final OrderRepository orderRepository;
    private final ShippingRepository repository;
    private final ListRepository listRepository;
    private final ClientRepository clientRepository;
    private final CargoRepository cargoRepository;

    private final OrderService orderService;
    private final CargoService cargoService;
    private final DocumentService documentService;

    private final MapperUtil mapper;

    public HttpEntity<?> saveAndUpdateShipping(ShippingDto dto){
        ShippingEntity entity = dto.getId() == null
                ? mapper.toShippingEntity(dto)
                : mapper.updateShippingEntity(dto, repository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", dto.getId())));

        if (dto.getId() == null) {
            Optional<ShippingEntity> opt = repository.getFirstByOrderByCreatedAtDesc();
            if (opt.isEmpty())
                entity.setNum(CommonUtils.generateNextNum("R", ""));
            else
                entity.setNum(CommonUtils.generateNextNum("R", opt.get().getNum()));
        }

        Set<OrderEntity> orderEntities = new HashSet<>();
        if (dto.getOrderId() != null) {
            orderEntities.add(orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipping", "orderId", dto.getOrderId())));
        }

        if (dto.getCargoList() != null) {
            List<CargoEntity> cargoEntities = new ArrayList<>();
            for (UUID id : dto.getCargoList()) {
                CargoEntity cargoEntity = cargoRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Shipping", "cargoId", id));
                orderEntities.add(cargoEntity.getOrder());
                cargoEntities.add(cargoEntity);
            }
            entity.setCargoEntities(cargoEntities);
        }
        entity.setOrderEntities(new ArrayList<>(orderEntities));

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
        ShippingEntity entity = repository.getShippingById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", id));
        ShippingDto dto = mapper.toShippingDto(entity);
        if (entity.getCargoEntities() != null) {
            List<UUID> cargoIds = new ArrayList<>();
            for (CargoEntity cargo : entity.getCargoEntities()) {
                cargoIds.add(cargo.getId());
            }
            dto.setCargoList(cargoIds);
        }
        return dto;
    }

    public List<ResShipping> getShippingListByOrderId(UUID id) {
        return getShippingList(
                repository.getAllByOrderEntitiesInAndStateGreaterThan(
                        Arrays.asList(
                                orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Shipping", "cargoId", id))),
                        0));
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

        if (entity.getOrderEntities() != null) {
            List<ResOrder> orderList = new ArrayList<>();
            for (OrderEntity order : entity.getOrderEntities()) {
                orderList.add(orderService.getResOrder(order, true));
            }
            res.setOrderList(orderList);
        }

        if (entity.getCargoEntities() != null) {
            List<ResCargo> cargoList = new ArrayList<>();
            for (CargoEntity cargo : entity.getCargoEntities()) {
                cargoList.add(cargoService.getCargo(cargo));
            }
            res.setCargoList(cargoList);
        }

        if (entity.getDocuments() != null)
            res.setDocuments(documentService.getDocumentDto(entity.getDocuments()));

        return res;
    }

    public HttpEntity<?> removeCargoById(UUID shippingId, UUID cargoId) {
        ShippingEntity shipping = repository.findById(shippingId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", shippingId));
        CargoEntity cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", cargoId));
        shipping.getCargoEntities().remove(cargo);
        repository.saveAndFlush(shipping);
        return ResponseEntity.ok().body(new ApiResponse("Груз удалено успешно", true));
    }

    public HttpEntity<?> addDocument(DocumentDto dto) {
        DocumentEntity document = documentService.saveAndUpdate(dto);
        ShippingEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", dto.getOwnerId()));

        if (entity.getDocuments() != null) {
            Set<DocumentEntity> set = new HashSet<>(entity.getDocuments());
            set.add(document);
            entity.setDocuments(new ArrayList<>(set));
        } else
            entity.setDocuments(Arrays.asList(document));

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }
}
