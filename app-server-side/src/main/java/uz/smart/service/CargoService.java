package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 08.11.2021. 
*/

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.AttachmentDto;
import uz.smart.dto.CargoDetailDto;
import uz.smart.dto.CargoDto;
import uz.smart.entity.*;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.CargoMapper;
import uz.smart.mapper.OrderMapper;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ResCargo;
import uz.smart.payload.ResOrder;
import uz.smart.repository.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class CargoService {

    private final CargoRepository repository;
    private final CargoDetailRepository detailRepository;
    private final ListRepository listRepository;
    private final AttachmentRepository attachmentRepository;
    private final OrderRepository orderRepository;

    private final CargoMapper mapper;
    private final OrderMapper orderMapper;

    public HttpEntity<?> saveAndUpdate(CargoDto dto) {
        CargoEntity entity = dto.getId() == null
                ? mapper.toEntity(dto, new CargoEntity())
                : mapper.toEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", dto.getId())));

        OrderEntity order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "orderId", dto.getId()));
        entity.setOrder(order);

        if (dto.getSenderCountryId() != null) {
            ListEntity senderCountry = listRepository.findById(dto.getSenderCountryId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "senderCountryId", dto.getSenderCountryId()));
            entity.setSenderCountryName(senderCountry.getNameRu());
        }
        if (dto.getReceiverCountryId() != null) {
            ListEntity receiverCountry = listRepository.findById(dto.getReceiverCountryId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "receiverCountryId", dto.getReceiverCountryId()));
            entity.setReceiverCountryName(receiverCountry.getNameRu());
        }
        if (dto.getCustomFromCountryId() != null) {
            ListEntity customFromCountry = listRepository.findById(dto.getCustomFromCountryId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "customFromCountryId", dto.getCustomFromCountryId()));
            entity.setCustomFromCountryName(customFromCountry.getNameRu());
        }
        if (dto.getCustomToCountryId() != null) {
            ListEntity customToCountry = listRepository.findById(dto.getCustomToCountryId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "customToCountryId", dto.getCustomToCountryId()));
            entity.setCustomToCountryName(customToCountry.getNameRu());
        }
        List<CargoDetailEntity> cargoDetails = new ArrayList<>();
        if (dto.getCargoDetails() != null) {
            for (CargoDetailDto detailDto : dto.getCargoDetails()) {
                CargoDetailEntity detailEntity = detailDto.getId() == null
                        ? mapper.toDetailEntity(detailDto, new CargoDetailEntity())
                        : mapper.toDetailEntity(detailDto, detailRepository.findById(detailDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Carrier", "Id", dto.getId())));
                ListEntity packegeType = listRepository.findById(detailDto.getPackageTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException("List", "packegeTypeId", detailDto.getPackageTypeId()));
                detailEntity.setPackageTypeName(packegeType.getNameRu());

                cargoDetails.add(detailRepository.saveAndFlush(detailEntity));
            }
        }
        entity.setCargoDetails(cargoDetails);

        List<Attachment> senderAttachmentList = new ArrayList<>();
        List<Attachment> receiverAttachmentList = new ArrayList<>();
        List<Attachment> customFromAttachmentList = new ArrayList<>();
        List<Attachment> customToAttachmentList = new ArrayList<>();

        if (dto.getSenderAttachments() != null) {
            for (AttachmentDto attachmentDto : dto.getSenderAttachments()) {
                senderAttachmentList.add(attachmentRepository.findById(attachmentDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("List", "attachmentId", attachmentDto.getId())));
            }
        }
        if (dto.getReceiverAttachments() != null) {
            for (AttachmentDto attachmentDto : dto.getReceiverAttachments()) {
                receiverAttachmentList.add(attachmentRepository.findById(attachmentDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("List", "attachmentId", attachmentDto.getId())));
            }
        }
        if (dto.getCustomFromAttachments() != null) {
            for (AttachmentDto attachmentDto : dto.getCustomFromAttachments()) {
                customFromAttachmentList.add(attachmentRepository.findById(attachmentDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("List", "attachmentId", attachmentDto.getId())));
            }
        }
        if (dto.getCustomToAttachments() != null) {
            for (AttachmentDto attachmentDto : dto.getCustomToAttachments()) {
                customToAttachmentList.add(attachmentRepository.findById(attachmentDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("List", "attachmentId", attachmentDto.getId())));
            }
        }

        entity.setSenderAttachments(senderAttachmentList);
        entity.setReceiverAttachments(receiverAttachmentList);
        entity.setCustomFromAttachments(customFromAttachmentList);
        entity.setCustomToAttachments(customToAttachmentList);

        repository.save(entity);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteCargo(UUID id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public CargoDto getCargo(UUID id) {
        CargoEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", id));

        return getCargo(entity);
    }

    public List<ResCargo> getCargoListByOrderId(UUID orderId) {
        return getCargoList(repository.getAllByOrder_IdAndStateGreaterThan(orderId, 0));
    }

    public List<ResCargo> getCargoList() {
        List<CargoEntity> entityList = repository.getAllCargos();
        return getCargoList(entityList);
    }

    private List<ResCargo> getCargoList(List<CargoEntity> entityList) {
        List<ResCargo> list = new ArrayList<>();
        for (CargoEntity entity : entityList) {
            ResCargo resCargo = getCargo(entity);
            ResOrder resOrder = orderMapper.toResOrder(entity.getOrder());
            resCargo.setOrderNum(resOrder.getNum());
            resCargo.setClientName(resOrder.getClientName());
            list.add(resCargo);
        }

        return list;
    }

    private ResCargo getCargo(CargoEntity entity) {
        ResCargo dto = mapper.toDto(entity);
        dto.setOrderId(entity.getOrder().getId());
        dto.setCargoDetails(mapper.toDetailDto(entity.getCargoDetails()));
        dto.setSenderAttachments(mapper.toAttachmentDto(entity.getSenderAttachments()));
        dto.setReceiverAttachments(mapper.toAttachmentDto(entity.getReceiverAttachments()));
        dto.setCustomFromAttachments(mapper.toAttachmentDto(entity.getCustomFromAttachments()));
        dto.setCustomToAttachments(mapper.toAttachmentDto(entity.getCustomToAttachments()));

        return dto;
    }

}
