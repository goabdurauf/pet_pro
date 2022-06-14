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
import uz.smart.payload.*;
import uz.smart.projection.report.OrderGrowthCount;
import uz.smart.repository.*;
import uz.smart.utils.AppConstants;
import uz.smart.utils.CommonUtils;

import javax.servlet.http.HttpServletResponse;
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
  @Autowired
  ReportService reportService;

  private final SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");

  public HttpEntity<?> saveAndUpdate(OrderDto dto) {
    OrderEntity entity = dto.getId() == null
            ? mapper.toOrderEntity(dto)
            : mapper.updateOrderEntity(dto, repository.findById(dto.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Order", "Id", dto.getId())));

    if (dto.getId() == null) {
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
    List<Integer> statesOfOrderCargo = cargoRepository.getStatesByOrderId(id);
    if (!statesOfOrderCargo.isEmpty()) {
      boolean isNotStateActive = statesOfOrderCargo
              .stream()
              .allMatch(el -> el == 0);

      if (!isNotStateActive) {
        return ResponseEntity.ok().body(new ApiResponse("Ошибка, у этого клиента есть груз!", false));
      }
    }

    repository.updateById(id);
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
              req.getNum() != null ? req.getNum().toLowerCase() : null,
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

    if (shipping != null && shipping.getCargoEntities() != null && shipping.getCargoEntities().size() > 0) {
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
        if (res.getKey().equals(select.getKey())) {
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


  public List<OrderGrowthCount> getClientCountByCreatedAt(Date begin, Date end) {
    return repository.getOrderCountByCreatedAt(begin, end);
  }

  public List<ResOrder> getOrderReportByFilter(ReqOrderSearch req) {
    List<OrderEntity> orderReportByFilter;
    try {
      orderReportByFilter = repository.getOrderReportByFilter(
          req.getNum(),
          new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
          new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.END_DATE).getTime()),
          req.getClientId(), req.getManagerId(), req.getStatusId());
    } catch (ParseException e) {
      e.printStackTrace();
      return new ArrayList<>();
    }
    return getResOrderList(orderReportByFilter, true);
  }


  public List<OrderReport> reportMapper(ReqOrderSearch req) {
    List<ResOrder> orderReport = getOrderReportByFilter(req);
    List<OrderReport> orderReports = new ArrayList<>();

    for (ResOrder resOrder : orderReport) {
      OrderReport report = new OrderReport();
      report.setNum(resOrder.getNum());
      report.setDate(resOrder.getDate());
      report.setStatusId(resOrder.getStatusId());
      report.setStatusName(resOrder.getStatusName());
      report.setClientName(resOrder.getClientName());
      report.setManagerName(resOrder.getManagerName());
      if (!resOrder.getShippingList().isEmpty()) {
        for (ResShipping resShipping : resOrder.getShippingList()) {
          report.setCurrierName(resShipping.getCarrierName());
          report.setShippingNum(resShipping.getNum());
          report.setTransportNum(resShipping.getShippingNum());
        }
      }
      orderReports.add(report);
    }
    return orderReports;
  }

  public void getExcelFile(HttpServletResponse response, ReqOrderSearch req) {
    List<OrderReport> orderReports = reportMapper(req);
    String[] sheetNames = {"Заказы"};
    String templateName = "OrderReport.jrxml";
    String fileName = "OrderReport";
    reportService.getExcelFile(response, new Report<>(templateName, sheetNames, fileName, new HashMap<>(), orderReports));
  }

}
