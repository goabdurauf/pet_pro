package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.DocumentDto;
import uz.smart.dto.ExpenseDto;
import uz.smart.dto.ShippingDto;
import uz.smart.entity.*;
import uz.smart.entity.enums.ExpenseType;
import uz.smart.entity.enums.ShippingStatus;
import uz.smart.entity.template.AbsEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.*;
import uz.smart.repository.*;
import uz.smart.utils.CommonUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ShippingService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    CarrierRepository carrierRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    ShippingRepository repository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    CargoRepository cargoRepository;
    @Autowired
    DocumentRepository documentRepository;
    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    OrderService orderService;
    @Autowired
    DocumentService documentService;
    @Autowired
    CargoService cargoService;
    @Autowired
    ExpenseService expenseService;
    @Autowired
    MapperUtil mapper;


    public HttpEntity<?> saveAndUpdateShipping(ShippingDto dto) {
        ShippingEntity entity = dto.getId() == null
                ? mapper.toShippingEntity(dto)
                : mapper.updateShippingEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", dto.getId())));

        if (dto.getId() == null || (entity.getStatus() == ShippingStatus.Draft && dto.getStatusId() == null)) {
            if (dto.getStatusId() == null) {
                entity.setStatus(ShippingStatus.Standart);
                Optional<ShippingEntity> opt = repository.getFirstByStatusOrderByCreatedAtDesc(ShippingStatus.Standart);
                if (opt.isEmpty())
                    entity.setNum(CommonUtils.generateNextNum("R", ""));
                else
                    entity.setNum(CommonUtils.generateNextNum("R", opt.get().getNum()));
            } else {
                entity.setStatus(ShippingStatus.Draft);
                Optional<ShippingEntity> opt = repository.getFirstByStatusOrderByCreatedAtDesc(ShippingStatus.Draft);
                if (opt.isEmpty())
                    entity.setNum("R-P-01");
                else {
                    String lastNum = opt.get().getNum();
                    int num = Integer.parseInt(lastNum.substring(lastNum.lastIndexOf('-') + 1)) + 1;
                    entity.setNum("R-P-" + (num < 10 ? "0" + num : num));
                }
            }
        }

        if (dto.getTransportKindId() != null) {
            ListEntity transportKind = listRepository.findById(dto.getTransportKindId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "transportKindId", dto.getTransportKindId()));
            entity.setTransportKindName(transportKind.getNameRu());
        }
        if (dto.getTransportConditionId() != null) {
            ListEntity transportCondition = listRepository.findById(dto.getTransportConditionId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "transportConditionId", dto.getTransportConditionId()));
            entity.setTransportConditionName(transportCondition.getNameRu());
        }

        entity = repository.saveAndFlush(entity);

        Set<OrderEntity> orderEntities = new HashSet<>();
        if (dto.getOrderId() != null) {
            orderEntities.add(orderRepository.findById(dto.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipping", "orderId", dto.getOrderId())));
        }

        setCargoShippingToNull(entity);

        if (dto.getCargoList() != null) {
            List<CargoEntity> cargoEntities = new ArrayList<>();
            for (UUID id : dto.getCargoList()) {
                CargoEntity cargoEntity = cargoRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Shipping", "cargoId", id));
                cargoEntity.setShipping(entity);
                cargoEntity = cargoRepository.saveAndFlush(cargoEntity);
                orderEntities.add(cargoEntity.getOrder());
                cargoEntities.add(cargoEntity);
            }
            entity.setCargoEntities(cargoEntities);
        }
        entity.setOrderEntities(new ArrayList<>(orderEntities));

        if (dto.getCurrencyId() != null) {
            ListEntity currency = listRepository.findById(dto.getCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
            entity.setCurrencyName(currency.getNameRu());
        }

        repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteShipping(UUID id) {
        ShippingEntity entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", id));

        if (entity.getDocuments() != null && entity.getDocuments().size() > 0) {
            List<DocumentEntity> documentList = entity.getDocuments().stream().map(document -> documentRepository.findById(document.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shipping", "documentId", document.getId()))).collect(Collectors.toList());
            entity.setDocuments(null);
            entity = repository.saveAndFlush(entity);
            documentService.deleteAllDocuments(documentList);
        }
        setCargoShippingToNull(entity);

        repository.delete(entity);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    private void setCargoShippingToNull(ShippingEntity entity) {
        if (entity.getCargoEntities() != null && entity.getCargoEntities().size() > 0) {
            for (CargoEntity cargo : entity.getCargoEntities()) {
                cargo.setShipping(null);
                cargoRepository.saveAndFlush(cargo);
            }
        }
    }

    public ShippingDto getShipping(UUID id) {
        ShippingEntity entity = repository.getShippingById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", id));
        ShippingDto dto = mapper.toShippingDto(entity);
        if (entity.getCargoEntities() != null) {
            dto.setCargoList(entity.getCargoEntities().stream().map(AbsEntity::getId).collect(Collectors.toList()));
        }
        dto.setStatusId(entity.getStatus().get());
        dto.setOrderSelect(orderService.getOrdersForSelect(entity));

        return dto;
    }

    public List<ResShipping> getShippingListByOrderId(UUID id) {
        return getShippingList(
                repository.getAllByOrderEntitiesInAndStateGreaterThan(
                        List.of(orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Shipping", "cargoId", id))),
                        0), true);
    }

    public List<ResShipping> getShippingList() {
        List<ShippingEntity> entityList = repository.getAllShipping();
        return getShippingList(entityList, true);
    }

    public List<ResShipping> getShippingList(List<ShippingEntity> entityList, boolean hasDetails) {
        List<ResShipping> list = new ArrayList<>();
        for (ShippingEntity entity : entityList) {
            list.add(getResShipping(entity, hasDetails));
        }
        return list;
    }

    public ResShipping getResShipping(UUID id) {
        return getResShipping(repository.getShippingById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", id)), true);
    }

    public ResShipping getResShipping(ShippingEntity entity, boolean hasDetails) {
        ResShipping res = mapper.toResShipping(entity);
        if (entity.getManagerId() != null) {
            User manager = userRepository.findById(entity.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "managerId", entity.getManagerId()));
            res.setManagerName(manager.getFullName());
        }
        res.setStatusId(entity.getStatus().get());
        if (entity.getCarrierId() != null) {
            CarrierEntity carrier = carrierRepository.findById(entity.getCarrierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Carrier", "carrierId", entity.getCarrierId()));
            res.setCarrierName(carrier.getName());
        }
        if (hasDetails) {
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

            ListEntity shType = listRepository.findById(entity.getShippingTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "shippingTypeId", entity.getShippingTypeId()));
            res.setShippingTypeName(shType.getNameRu());
            res.setShippingTypeCapacity(shType.getNum01());
            res.setShippingTypeWeight(shType.getNum02());
            res.setShippingTypeSize(shType.getVal01());

            if (entity.getDocuments() != null)
                res.setDocuments(documentService.getDocumentDto(entity.getDocuments()));
        }

        return res;
    }

    public ResShippingDivide getResShippingDivide(UUID shippingId, UUID expenseId) {
        List<ResDivide> list = new ArrayList<>();
        ShippingEntity shipping = repository.getShippingById(shippingId).orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", shippingId));
        if (shipping.getCargoEntities() == null || shipping.getCargoEntities().size() == 0)
            return new ResShippingDivide();

        ExpenseEntity expense = expenseRepository.findById(expenseId).orElseThrow(() -> new ResourceNotFoundException("Expense", "id", expenseId));
        ResShippingDivide res = new ResShippingDivide();
        res.setId(expenseId);
        res.setExpensePrice(expense.getToFinalPrice());

        for (CargoEntity cargo : shipping.getCargoEntities()) {
            ResDivide divide = new ResDivide();
            divide.setOwnerId(cargo.getId());
            divide.setShippingNum(shipping.getNum());
            divide.setOrderNum(cargo.getOrder().getNum());
            ClientEntity client = clientRepository.findById(cargo.getOrder().getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Client", "id", cargo.getOrder().getClientId()));
            divide.setClientName(client.getName());
            divide.setCargoName(cargo.getNum() + " - " + cargo.getName());
            if (cargo.getCargoDetails() != null && cargo.getCargoDetails().size() > 0) {
                for (CargoDetailEntity cargoDetail : cargo.getCargoDetails()) {
                    divide.setWeight(divide.getWeight().add(cargoDetail.getWeight()));
                    divide.setCapacity(divide.getCapacity().add(cargoDetail.getCapacity()));
                    divide.setPackageAmount(divide.getPackageAmount().add(cargoDetail.getPackageAmount()));

                    res.setTotalWeight(res.getTotalWeight().add(cargoDetail.getWeight()));
                    res.setTotalCapacity(res.getTotalCapacity().add(cargoDetail.getCapacity()));
                }
            }
            ExpenseEntity savedExpense = expenseRepository.findByOwnerIdAndOldId(cargo.getId(), expenseId).orElse(null);
            divide.setFinalPrice(savedExpense == null ? BigDecimal.ZERO : savedExpense.getToFinalPrice());
            divide.setId(savedExpense == null ? null : savedExpense.getId());

            list.add(divide);
        }
        res.setDivideList(list);

        return res;
    }

    public HttpEntity<?> removeCargoById(UUID shippingId, UUID cargoId) {
        ShippingEntity shipping = repository.findById(shippingId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", shippingId));
        CargoEntity cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", cargoId));
        shipping.getCargoEntities().remove(cargo);
        repository.saveAndFlush(shipping);
        cargo.setShipping(null);
        cargoRepository.saveAndFlush(cargo);
        return ResponseEntity.ok().body(new ApiResponse("Груз удалено успешно", true));
    }

    public List<DocumentDto> addDocument(DocumentDto dto) {
        DocumentEntity document = documentService.saveAndUpdate(dto);
        ShippingEntity entity = repository.findById(dto.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", dto.getOwnerId()));

        if (entity.getDocuments() != null) {
            Set<DocumentEntity> set = new HashSet<>(entity.getDocuments());
            set.add(document);
            entity.setDocuments(new ArrayList<>(set));
        } else
            entity.setDocuments(List.of(document));

        entity = repository.saveAndFlush(entity);

        return documentService.getDocumentDto(entity.getDocuments());
    }

    public List<DocumentDto> removeDocumentById(UUID shippingId, UUID docId) {
        ShippingEntity entity = repository.findById(shippingId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", shippingId));
        DocumentEntity document = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "docId", docId));

        entity.getDocuments().remove(document);
        entity = repository.saveAndFlush(entity);
        documentService.deleteDocument(document);

        return documentService.getDocumentDto(entity.getDocuments());
    }

    public List<ExpenseDto> addExpense(ExpenseDto dto) {
        ShippingEntity entity = repository.findById(dto.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", dto.getOwnerId()));
        dto.setType(ExpenseType.Shipping);
        ExpenseEntity expenseEntity = expenseService.saveAndUpdate(dto);
        entity.getExpenseList().add(expenseEntity);

        entity = repository.saveAndFlush(entity);
        return getExpensesByShipping(entity);
    }

    public List<ExpenseDto> getExpensesByShipping(ShippingEntity entity) {
        List<ExpenseDto> expenseList = new ArrayList<>();
        if (entity.getExpenseList() == null || entity.getExpenseList().size() == 0)
            return expenseList;

        return expenseService.getExpenseDto(entity.getExpenseList(), entity.getNum(), "");
    }

    public List<ExpenseDto> getExpensesByShippingId(UUID shippingId) {
        return getExpensesByShipping(repository.findById(shippingId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", shippingId)));
    }

    public HttpEntity<?> deleteExpenseFromShipping(UUID id) {
        ExpenseEntity expenseEntity = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", id));
        ShippingEntity shippingEntity = repository.findById(expenseEntity.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", expenseEntity.getOwnerId()));
        shippingEntity.getExpenseList().remove(expenseEntity);
        repository.saveAndFlush(shippingEntity);
        expenseRepository.delete(expenseEntity);

        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }
}
