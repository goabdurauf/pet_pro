package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021. 
*/

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.ClientDto;
import uz.smart.entity.ClientEntity;
import uz.smart.entity.ListEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.ClientRepository;
import uz.smart.repository.ListRepository;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class ClientService {

    private final ClientRepository repository;
    private final ListRepository listRepository;
    private final MapperUtil mapperUtil;

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
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public ClientDto getClient(UUID id) {
        return mapperUtil.toClientDto(repository.getClientById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id)));
    }

    public List<ClientDto> getClientList() {
        return mapperUtil.toClientDto(repository.getAllClients());
    }
}
