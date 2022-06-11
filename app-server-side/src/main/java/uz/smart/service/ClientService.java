package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021. 
*/

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.ClientDto;
import uz.smart.dto.ClientReportDto;
import uz.smart.entity.ClientEntity;
import uz.smart.entity.ListEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.projection.ClientGrowthCount;
import uz.smart.repository.ClientRepository;
import uz.smart.repository.ListRepository;
import uz.smart.repository.OrderRepository;

import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ClientService {

  private final ClientRepository repository;
  private final ListRepository listRepository;
  private final OrderRepository orderRepository;

  private final MapperUtil mapperUtil;

  private Long days = 120L;

  public HttpEntity<?> saveAndUpdateClient(ClientDto dto) {
    ClientEntity entity = dto.getId() == null
            ? mapperUtil.toClientEntity(dto)
            : mapperUtil.updateClientEntity(dto, repository.findById(dto.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Client", "Id", dto.getId())));

    ListEntity country = listRepository.findById(dto.getCountryId())
            .orElseThrow(() -> new ResourceNotFoundException("List", "countryId", dto.getCountryId()));
    entity.setCountryName(country.getNameRu());

    ListEntity about = listRepository.findById(dto.getAboutId())
            .orElseThrow(() -> new ResourceNotFoundException("List", "aboutId", dto.getAboutId()));
    entity.setAboutName(about.getNameRu());

    repository.save(entity);
    return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
  }

  public HttpEntity<?> deleteClient(UUID id) {
    List<Integer> stateOfClientOrder = orderRepository.getStatesByClientId(id);

    if (!stateOfClientOrder.isEmpty()) {
      boolean isNotStateActive = stateOfClientOrder
              .stream()
              .allMatch(el -> el == 0);

      if (!isNotStateActive) {
        return ResponseEntity.ok().body(new ApiResponse("Ошибка, у этого клиента есть доступные заказы!", false));
      }
    }

    repository.updateById(id);
    return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
  }

  public ClientDto getClient(UUID id) {
    return mapperUtil.toClientDto(repository.getClientById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id)));
  }

  public List<ClientDto> getClientList() {
    List<ClientDto> resList = new ArrayList<>();
    List<ClientEntity> clients = repository.getAllClients();
    for (ClientEntity entity : clients) {
      ClientDto dto = mapperUtil.toClientDto(entity);
      orderRepository.getFirstByClientIdOrderByCreatedAtDesc(entity.getId())
              .ifPresent(order -> dto.setLastOrder(TimeUnit.DAYS.convert(Math.abs(new Date().getTime() - order.getCreatedAt().getTime()), TimeUnit.MILLISECONDS)));
      resList.add(dto);
    }

    return resList;
  }

  public ClientReportDto getClientReport(Long day) {
    if (day != -1)
      days = day;
    return new ClientReportDto(
            repository.countAllByState(1),
            orderRepository.getActiveClientsCount(days),
            days
    );
  }

  public List<ClientGrowthCount> getClientCountByCreatedAt(Date begin, Date end) {
   return repository.getClientCountByCreatedAt(begin, end);
  }
}
