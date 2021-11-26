package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 08.11.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import uz.smart.dto.AttachmentDto;
import uz.smart.dto.CargoDetailDto;
import uz.smart.dto.CargoDto;
import uz.smart.dto.DocumentDto;
import uz.smart.entity.*;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ResCargo;
import uz.smart.payload.ResOrder;
import uz.smart.payload.ResShipping;
import uz.smart.repository.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CargoService {

    @Autowired
    CargoRepository repository;
    @Autowired
    CargoDetailRepository detailRepository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    AttachmentContentRepository attachmentContentRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    DocumentRepository documentRepository;
    @Autowired
    ShippingRepository shippingRepository;
    @Autowired
    DocumentService documentService;
    @Autowired
    OrderService orderService;
    @Autowired
    ShippingServiceImpl shippingService;
    @Autowired
    MapperUtil mapper;

    public HttpEntity<?> saveAndUpdate(CargoDto dto) {
        CargoEntity entity = dto.getId() == null
                ? mapper.toCargoEntity(dto, new CargoEntity())
                : mapper.toCargoEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", dto.getId())));

        OrderEntity order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "orderId", dto.getId()));
        entity.setOrder(order);

        if (dto.getId() == null) {
            List<CargoEntity> entityList = repository.getAllByOrder_IdAndStateGreaterThanOrderByCreatedAt(order.getId(), 0);
            if (entityList.size() > 0) {
                String lastNum = entityList.get(entityList.size() - 1).getNum();
                int num = Integer.parseInt(lastNum.substring(lastNum.lastIndexOf("-") + 1)) + 1;
                entity.setNum(lastNum.substring(0, lastNum.lastIndexOf("-") + 1) + num);
            } else
                entity.setNum(order.getNum() + "-" + 1);
        }

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
                        ? mapper.toCargoDetailEntity(detailDto, new CargoDetailEntity())
                        : mapper.toCargoDetailEntity(detailDto, detailRepository.findById(detailDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Carrier", "Id", dto.getId())));
                ListEntity packegeType = listRepository.findById(detailDto.getPackageTypeId())
                        .orElseThrow(() -> new ResourceNotFoundException("List", "packegeTypeId", detailDto.getPackageTypeId()));
                detailEntity.setPackageTypeName(packegeType.getNameRu());

                detailEntity = detailRepository.saveAndFlush(detailEntity);
                cargoDetails.add(detailEntity);
            }
        }
        entity.setCargoDetails(cargoDetails);

        if (StringUtils.hasText(dto.getDocTitle())) {
            DocumentEntity document = dto.getDocId() == null
                    ? mapper.toDocumentEntity(new DocumentDto(null, dto.getDocTitle(), dto.getDocDate(), dto.getDocCommet()), new DocumentEntity())
                    : mapper.toDocumentEntity(new DocumentDto(dto.getDocId(), dto.getDocTitle(), dto.getDocDate(), dto.getDocCommet()),
                        documentRepository.findById(dto.getDocId()).orElseThrow(() -> new ResourceNotFoundException("Cargo", "documentId", dto.getDocId())));

            if (dto.getDocAttachments() != null && dto.getDocAttachments().size() > 0) {
                Set<UUID> list = dto.getDocAttachments().stream().map(AttachmentDto::getId).collect(Collectors.toSet());
                List<Attachment> attachmentList = attachmentRepository.findAllByIdIn(new ArrayList<>(list));
                document.setAttachments(attachmentList);
            }

            document = documentRepository.save(document);

            entity.setDocument(document);
        }

        repository.save(entity);


        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> cloneCargo(CargoDto dto) {
        for (CargoDetailDto detailDto : dto.getCargoDetails()) {
            CargoDetailEntity detailEntity = detailRepository.findById(detailDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("CargoDetail", "Id", detailDto.getId()));
            if (detailEntity.getWeight().subtract(detailDto.getWeight()).floatValue() <= 0)
                return ResponseEntity.ok().body(new ApiResponse("Новая значения веса не должно быть равно и больше от старое значение.", false));
            if (detailEntity.getCapacity().subtract(detailDto.getCapacity()).floatValue() <= 0)
                return ResponseEntity.ok().body(new ApiResponse("Новая значения объёма не должно быть равно и больше от старое значение.", false));
            if (detailEntity.getPackageAmount().subtract(detailDto.getPackageAmount()).floatValue() <= 0)
                return ResponseEntity.ok().body(new ApiResponse("Новая значения упаковки не должно быть равно и больше от старое значение.", false));
        }
        for (CargoDetailDto detailDto : dto.getCargoDetails()) {
            CargoDetailEntity detailEntity = detailRepository.findById(detailDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("CargoDetail", "Id", detailDto.getId()));
            detailEntity.setWeight(detailEntity.getWeight().subtract(detailDto.getWeight()));
            detailEntity.setCapacity(detailEntity.getCapacity().subtract(detailDto.getCapacity()));
            detailEntity.setPackageAmount(detailEntity.getPackageAmount().subtract(detailDto.getPackageAmount()));
            detailRepository.saveAndFlush(detailEntity);
            detailDto.setId(null);
        }

        dto.setId(null);
        dto.setDocId(null);
        if (dto.getDocAttachments() != null && dto.getDocAttachments().size() > 0) {
            List<AttachmentDto> list = new ArrayList<>();
            for (AttachmentDto attachmentDto : dto.getDocAttachments()) {
                Attachment attachment = attachmentRepository.findById(attachmentDto.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Attachment", "Id", attachmentDto.getId()));
                AttachmentContent attachmentContent = attachmentContentRepository.findByAttachment(attachment)
                        .orElseThrow(() -> new ResourceNotFoundException("Attachment Content", "attachment id", attachmentDto.getId()));

                Attachment newAtt = new Attachment(attachment.getName(), attachment.getContentType(), attachment.getSize());
                newAtt = attachmentRepository.saveAndFlush(newAtt);
                AttachmentContent newCont = new AttachmentContent(attachmentContent.getContent(), newAtt);
                attachmentContentRepository.saveAndFlush(newCont);
                list.add(mapper.toAttachmentDto(newAtt));
            }
            dto.setDocAttachments(list);
        }

        return saveAndUpdate(dto);
    }


    public HttpEntity<?> deleteCargo(UUID id) {
        CargoEntity cargoEntity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", id));
        ShippingEntity shippingEntity = shippingRepository.getByCargoEntitiesIn(Arrays.asList(cargoEntity)).orElse(null);
        if (shippingEntity != null){
            shippingEntity.getCargoEntities().remove(cargoEntity);
            shippingRepository.saveAndFlush(shippingEntity);
        }
        if (cargoEntity.getDocument() != null){
            DocumentEntity document = documentRepository.findById(cargoEntity.getDocument().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Document", "Id", id));
            cargoEntity.setDocument(null);
            cargoEntity = repository.saveAndFlush(cargoEntity);
            documentService.deleteDocument(document);
        }
        repository.delete(cargoEntity);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public CargoDto getCargo(UUID id) {
        CargoEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", id));

        return getCargo(entity);
    }

    public List<ResCargo> getCargoListByOrderId(UUID orderId) {
        return getCargoList(repository.getAllByOrder_IdAndStateGreaterThanOrderByCreatedAt(orderId, 0));
    }

    public List<DocumentDto> getCargoDocumentsByOrderId(UUID orderId) {
        List<DocumentDto> documentList = new ArrayList<>();
        List<CargoEntity> cargoList = repository.getAllByOrder_IdAndStateGreaterThanOrderByCreatedAt(orderId, 0);
        if (cargoList == null || cargoList.size() == 0)
            return documentList;
        for (CargoEntity cargo : cargoList) {
            DocumentDto documentDto = documentService.getDocumentDto(cargo.getDocument());
            if (documentDto != null)
                documentList.add(documentDto);
        }
        return documentList;
    }

    public List<ResCargo> getCargoList() {
        List<CargoEntity> entityList = repository.getAllCargos();
        return getCargoList(entityList);
    }

    private List<ResCargo> getCargoList(List<CargoEntity> entityList) {
        List<ResCargo> list = new ArrayList<>();
        for (CargoEntity entity : entityList) {
            ResCargo resCargo = getCargo(entity);
            ResOrder resOrder = orderService.getResOrder(entity.getOrder(), true);
            resCargo.setOrderNum(resOrder.getNum());
            resCargo.setClientName(resOrder.getClientName());

            ShippingEntity shippingEntity = shippingRepository.getByCargoEntitiesIn(Arrays.asList(entity)).orElse(null);
            if (shippingEntity != null) {
                ResShipping resShipping = shippingService.getResShipping(shippingEntity, false);
                resCargo.setCarrierName(resShipping.getCarrierName());
                resCargo.setShippingNum(resShipping.getNum());
            }

            list.add(resCargo);
        }

        return list;
    }

    public ResCargo getCargo(CargoEntity entity) {
        ResCargo dto = mapper.toResCargo(entity);
        dto.setOrderId(entity.getOrder().getId());
        dto.setCargoDetails(mapper.toCargoDetailDto(entity.getCargoDetails()));
        if (entity.getDocument() != null) {
            DocumentEntity document = entity.getDocument();
            dto.setDocId(document.getId());
            dto.setDocTitle(document.getTitle());
            dto.setDocDate(document.getDate());
            dto.setDocCommet(document.getComment());
            dto.setDocAttachments(mapper.toAttachmentDto(document.getAttachments()));
        }

        return dto;
    }

    public List<DocumentDto> removeDocumentByOrderId(UUID orderId, UUID docId) {
        CargoEntity entity = repository.findByDocument_Id(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "docId", docId));
        DocumentEntity document = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "Id", docId));

        entity.setDocument(null);
        repository.saveAndFlush(entity);
        documentService.deleteDocument(document);

        return getCargoDocumentsByOrderId(orderId);
    }

}
