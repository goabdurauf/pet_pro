package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 31.10.2021.
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.CargoTrackingDto;
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
import uz.smart.utils.AppConstants;
import uz.smart.utils.CommonUtils;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;
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
  InvoiceRepository invoiceRepository;

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

  private final SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");

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
    if (dto.getLoadStationId() != null) {
      ListEntity loadStation = listRepository.findById(dto.getLoadStationId())
              .orElseThrow(() -> new ResourceNotFoundException("List", "loadStationId", dto.getLoadStationId()));
      entity.setLoadStation(loadStation.getNameRu());
    }
    if (dto.getCustomStationId() != null) {
      ListEntity customStation = listRepository.findById(dto.getCustomStationId())
              .orElseThrow(() -> new ResourceNotFoundException("List", "customStationId", dto.getCustomStationId()));
      entity.setCustomStation(customStation.getNameRu());
    }
    if (dto.getUnloadStationId() != null) {
      ListEntity unloadStation = listRepository.findById(dto.getUnloadStationId())
              .orElseThrow(() -> new ResourceNotFoundException("List", "unloadStationId", dto.getUnloadStationId()));
      entity.setUnloadStation(unloadStation.getNameRu());
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
    if (entity.getLoadDate() != null && entity.getUnloadDate() != null) {
      long diff = Math.abs(entity.getLoadDate().getTime() - entity.getUnloadDate().getTime());
      entity.setDurationDays(TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS));
    }
    repository.save(entity);

       /*
        CargoTrackingEntity tracking = cargoTrackingRepository.findByShipping(entity).orElse(new CargoTrackingEntity());
        tracking.setShipping(entity);
        tracking.setLoadDate(entity.getLoadDate());
        tracking.setUnloadDate(entity.getUnloadDate());

        cargoTrackingRepository.saveAndFlush(tracking);
       */

    return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
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

  public HttpEntity<?> getShippingList(ReqShippingSearch req) {
    Set<ShippingEntity> list;
    long totalElement = 0;
    req.setWord(req.getWord() == null ? null : req.getWord().toLowerCase());
    try {
      list = repository.getShippingByFilter(
              req.getWord(), req.getWord(), req.getWord(),
              req.getTransportKindId(), req.getClientId(), req.getCarrierId(), req.getManagerId(),
              new Timestamp(format.parse(req.getLoadStart() != null ? req.getLoadStart() : AppConstants.BEGIN_DATE).getTime()),
              new Timestamp(format.parse(req.getLoadEnd() != null ? req.getLoadEnd() : AppConstants.END_DATE).getTime()),
              new Timestamp(format.parse(req.getUnloadStart() != null ? req.getUnloadStart() : AppConstants.END_DATE).getTime()),
              new Timestamp(format.parse(req.getUnloadEnd() != null ? req.getUnloadEnd() : AppConstants.END_DATE).getTime()),
              req.getPage() * req.getSize(), req.getSize());
      totalElement = repository.getShippingCountByFilter(
              req.getWord(), req.getWord(), req.getWord(),
              req.getTransportKindId(), req.getClientId(), req.getCarrierId(), req.getManagerId(),
              new Timestamp(format.parse(req.getLoadStart() != null ? req.getLoadStart() : AppConstants.BEGIN_DATE).getTime()),
              new Timestamp(format.parse(req.getLoadEnd() != null ? req.getLoadEnd() : AppConstants.END_DATE).getTime()),
              new Timestamp(format.parse(req.getUnloadStart() != null ? req.getUnloadStart() : AppConstants.END_DATE).getTime()),
              new Timestamp(format.parse(req.getUnloadEnd() != null ? req.getUnloadEnd() : AppConstants.END_DATE).getTime()));
    } catch (ParseException e) {
      e.printStackTrace();
      return ResponseEntity.ok(new ResPageable(new ArrayList<>(), totalElement, req.getPage()));
    }
    return ResponseEntity.ok(new ResPageable(getShippingListWithExpenses(new ArrayList<>(list)), totalElement, req.getPage()));
  }

  public List<ResShipping> getShippingListWithExpenses(List<ShippingEntity> entityList) {
    List<ResShipping> list = new ArrayList<>();
    for (ShippingEntity entity : entityList) {
      ResShipping resShipping = getResShipping(entity, true);
      if (entity.getExpenseList() != null && entity.getExpenseList().size() > 0) {
        List<ExpenseDto> expenseList = new ArrayList<>();
        for (ExpenseEntity expense : entity.getExpenseList()) {
          expenseList.add(new ExpenseDto(
                  expense.getId(),
                  ExpenseType.Shipping,
                  expense.getInvoiceInId(),
                  expense.getInvoiceOutId(),
                  expense.getFromCurrencyName(),
                  expense.getFromPrice()
          ));
        }
        resShipping.setExpenseList(expenseList);
      }

      list.add(resShipping);
    }
    return list;
  }

  public HttpEntity<?> deleteShipping(UUID id) {
    ShippingEntity shipping = repository.getShippingById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Shipping", "id", id));

    List<Integer> statesOfInvoice = invoiceRepository.getStatesByShippingId(id);
    if (!statesOfInvoice.isEmpty()) {
      boolean isNotStateActive = statesOfInvoice
              .stream()
              .allMatch(el -> el == 0);

      if (!isNotStateActive) {
        return ResponseEntity.ok().body(new ApiResponse("Ошибка, у этого клиента есть счета!", false));
      }
    }

    if (shipping.getCargoEntities() != null && shipping.getCargoEntities().size() != 0) {
      boolean shippingHasActiveCargo = shipping.getCargoEntities()
              .stream()
              .anyMatch(cargo -> cargo.getState() != 0);
      if (shippingHasActiveCargo) {
        return ResponseEntity.ok().body(new ApiResponse("Ошибка, у этого рейса есть груз!", false));
      }
    }
    repository.updateById(id);
    return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
  }

  public List<ResShipping> getShippingList() {
    List<ShippingEntity> entityList = repository.getAllShipping();
    return getShippingListWithExpenses(entityList);
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

  public HttpEntity<?> saveTracking(CargoTrackingDto dto) {
    ShippingEntity entity = repository.findById(dto.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", dto.getId()));
    entity.setFactoryAddressId(dto.getFactoryAddressId());
    entity.setLoadStationId(dto.getLoadStationId());
    entity.setUnloadStationId(dto.getUnloadStationId());
    entity.setChaseStatusId(dto.getChaseStatusId());
    entity.setCargoName(dto.getCargoName());
    entity.setKazahNumber(dto.getKazahNumber());
    entity.setCurrentLocation(dto.getCurrentLocation());
    entity.setTrackingComment(dto.getComment());
    entity.setLoadDate(dto.getLoadDate());
    entity.setDocPassDate(dto.getDocPassDate());
    entity.setLoadSendDate(dto.getLoadSendDate());
    entity.setCustomArrivalDate(dto.getCustomArrivalDate());
    entity.setCustomSendDate(dto.getCustomSendDate());
    entity.setContainerReturnDate(dto.getContainerReturnDate());
    entity.setUnloadDate(dto.getUnloadDate());

    if (entity.getLoadDate() != null && entity.getUnloadDate() != null) {
      long diff = Math.abs(entity.getLoadDate().getTime() - entity.getUnloadDate().getTime());
      entity.setDurationDays(TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS));
    }

    if (dto.getLoadStationId() != null) {
      ListEntity loadStation = listRepository.findById(dto.getLoadStationId())
              .orElseThrow(() -> new ResourceNotFoundException("List", "loadStationId", dto.getLoadStationId()));
      entity.setLoadStation(loadStation.getNameRu());
    } else
      entity.setLoadStation(null);

    if (dto.getUnloadStationId() != null) {
      ListEntity unloadStation = listRepository.findById(dto.getUnloadStationId())
              .orElseThrow(() -> new ResourceNotFoundException("List", "unloadStationId", dto.getUnloadStationId()));
      entity.setUnloadStation(unloadStation.getNameRu());
    } else
      entity.setUnloadStation(null);

    repository.saveAndFlush(entity);

    return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
  }

  public CargoTrackingDto getById(UUID id) {
    return getCargoTrackingDto(repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Shipping", "Id", id)));
  }

  public List<CargoTrackingDto> getListTrackingDto() {
    List<CargoTrackingDto> dtoList = new ArrayList<>();
    repository.getAllShipping().forEach(entity -> dtoList.add(getCargoTrackingDto(entity)));
    return dtoList;
  }

  private CargoTrackingDto getCargoTrackingDto(ShippingEntity entity) {
    CargoTrackingDto dto = mapper.fromShippingToTrackingDto(entity);
    if (entity.getDurationDays() == null && entity.getLoadDate() != null)
      dto.setDurationDays(TimeUnit.DAYS.convert(Math.abs(new Date().getTime() - entity.getLoadDate().getTime()), TimeUnit.MILLISECONDS));
    if (entity.getFactoryAddressId() != null)
      listRepository.findById(entity.getFactoryAddressId()).ifPresent(address -> dto.setFactoryAddress(address.getNameRu()));
    if (entity.getChaseStatusId() != null)
      listRepository.findById(entity.getChaseStatusId()).ifPresent(chase -> {
        dto.setChaseStatus(chase.getNameRu());
        dto.setChaseStatusColor(chase.getVal01());
      });
    if (entity.getCarrierId() != null)
      carrierRepository.findById(entity.getCarrierId()).ifPresent(carrierEntity -> dto.setCarrierName(carrierEntity.getName()));
    listRepository.findById(entity.getShippingTypeId()).ifPresent(shipType -> dto.setShippingType(shipType.getNameRu()));
    if (entity.getCargoEntities() != null) {
      entity.getCargoEntities().forEach(cargo -> {
        if (cargo.getCargoDetails() != null) {
          cargo.getCargoDetails().forEach(detail -> dto.setCargoWeight(dto.getCargoWeight().add(detail.getWeight())));
        }
      });
    }


    /* Get client's cargos, and details */
    List<InTrackingClient> inTrackingClients = new ArrayList<>();

    entity.getOrderEntities().forEach(order -> {
      // Get client from order
      ClientEntity client = clientRepository.getClientById(order.getClientId()).orElseThrow();

      // Get cargos from order
      List<CargoEntity> cargos = cargoRepository.getAllCargosByOrderId(order.getId());

      //Making new dto for tracking
      InTrackingClient inTrackingClient = new InTrackingClient();
      inTrackingClient.setClientId(client.getId());
      inTrackingClient.setClientName(client.getName());

      List<InTrackingClientCargo> clientCargos = new ArrayList<>();
      cargos.forEach(cargo -> {
        InTrackingClientCargo inTrackingClientCargo = new InTrackingClientCargo();
        inTrackingClientCargo.setCargoId(cargo.getId());
        inTrackingClientCargo.setCargoName(cargo.getName());
        inTrackingClientCargo.setCargoDetails(cargo.getCargoDetails());
        clientCargos.add(inTrackingClientCargo);
      });

      inTrackingClient.setClientCargos(clientCargos);
      inTrackingClients.add(inTrackingClient);
    });


    dto.setCargos(inTrackingClients);
    return dto;
  }

}
