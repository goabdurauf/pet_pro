package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 08.11.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.*;
import uz.smart.entity.*;
import uz.smart.entity.enums.ExpenseType;
import uz.smart.entity.template.AbsEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.*;
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
    ExpenseRepository expenseRepository;

    @Autowired
    DocumentService documentService;
    @Autowired
    OrderService orderService;
    @Autowired
    ShippingService shippingService;
    @Autowired
    ExpenseService expenseService;
    @Autowired
    MapperUtil mapper;

    private CargoEntity lastEntity;

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
        if (dto.getRegTypeId() != null) {
            ListEntity regType = listRepository.findById(dto.getRegTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "cargoRegTypeId", dto.getRegTypeId()));
            entity.setRegTypeName(regType.getNameRu());
        }

        ListEntity currency = listRepository.findById(dto.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
        entity.setCurrencyName(currency.getNameRu());

        entity.setCargoDetails(null);
        entity = repository.saveAndFlush(entity);

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

                detailEntity = detailRepository.save(detailEntity);
                cargoDetails.add(detailEntity);
            }
        }
        entity.setCargoDetails(cargoDetails);

        lastEntity = repository.saveAndFlush(entity);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public List<ResDocument> addDocument(DocumentDto dto) {
        CargoEntity entity = repository.findById(dto.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", dto.getOwnerId()));
        DocumentEntity document = documentService.saveAndUpdate(dto);

        if (dto.getId() == null) {
            entity.getDocumentList().add(document);
            repository.saveAndFlush(entity);
        }

        return getCargoDocumentsByOrderId(entity.getOrder().getId());
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

        List<DocumentEntity> oldDocuments = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", dto.getId())).getDocumentList();

        dto.setId(null);
        HttpEntity<?> response = saveAndUpdate(dto);

        List<DocumentEntity> documentEntityList = new ArrayList<>();
        if (oldDocuments != null && oldDocuments.size() > 0) {
            for (DocumentEntity oldDoc : oldDocuments) {
                DocumentEntity document = new DocumentEntity(oldDoc.getTitle(), oldDoc.getDate(), oldDoc.getComment());
                if (oldDoc.getAttachments() != null && oldDoc.getAttachments().size() > 0) {
                    List<Attachment> list = new ArrayList<>();
                    for (Attachment attachment : oldDoc.getAttachments()) {
                        AttachmentContent attachmentContent = attachmentContentRepository.findByAttachment(attachment)
                                .orElseThrow(() -> new ResourceNotFoundException("Attachment Content", "attachment id", attachment.getId()));

                        Attachment newAtt = new Attachment(attachment.getName(), attachment.getContentType(), attachment.getDocType(), attachment.getSize());
                        newAtt = attachmentRepository.saveAndFlush(newAtt);
                        AttachmentContent newCont = new AttachmentContent(attachmentContent.getContent(), newAtt);
                        attachmentContentRepository.saveAndFlush(newCont);
                        list.add(newAtt);
                    }
                    document.setAttachments(list);
                }
                documentEntityList.add(documentRepository.saveAndFlush(document));
            }
        }
        lastEntity.setDocumentList(documentEntityList);
        repository.saveAndFlush(lastEntity);

        return response;
    }

    public HttpEntity<?> deleteCargo(UUID id) {
        CargoEntity cargoEntity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", id));
        return deleteCargo(cargoEntity);
    }

    public HttpEntity<?> deleteCargo(CargoEntity cargoEntity) {
        ShippingEntity shippingEntity = shippingRepository.getByCargoEntitiesIn(List.of(cargoEntity)).orElse(null);
        if (shippingEntity != null){
            shippingEntity.getCargoEntities().remove(cargoEntity);
            shippingRepository.saveAndFlush(shippingEntity);
        }
        if (cargoEntity.getDocumentList() != null && cargoEntity.getDocumentList().size() > 0){
            List<UUID> docIdList = cargoEntity.getDocumentList().stream().map(AbsEntity::getId).collect(Collectors.toList());
            List<DocumentEntity> documentList = documentRepository.findAllByIdIn(docIdList);
            cargoEntity.setDocumentList(null);
            cargoEntity = repository.saveAndFlush(cargoEntity);
            documentService.deleteAllDocuments(documentList);
        }
        if (cargoEntity.getExpenseList() != null && cargoEntity.getExpenseList().size() > 0) {
            List<UUID> expenseIdList = cargoEntity.getExpenseList().stream().map(AbsEntity::getId).collect(Collectors.toList());
            cargoEntity.setExpenseList(null);
            cargoEntity = repository.saveAndFlush(cargoEntity);
            expenseService.deleteExpense(expenseIdList);
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

    public List<ResCargo> getCargoListForSelectByOrderId(UUID orderId) {
        List<ResCargo> list = new ArrayList<>();
        List<CargoEntity> entityList = repository.getAllByOrder_IdAndStateGreaterThanOrderByCreatedAt(orderId, 0);
        for (CargoEntity cargo : entityList) {
            list.add(new ResCargo(cargo.getId(), cargo.getName(), cargo.getNum()));
        }

        return list;
    }

    public List<ResDocument> getCargoDocumentsByOrderId(UUID orderId) {
        List<ResDocument> documentList = new ArrayList<>();
        List<CargoEntity> cargoList = repository.getAllByOrder_IdAndStateGreaterThanOrderByCreatedAt(orderId, 0);
        if (cargoList == null || cargoList.size() == 0)
            return documentList;
        for (CargoEntity cargo : cargoList) {
            for (DocumentEntity document : cargo.getDocumentList()) {
                DocumentDto documentDto = documentService.getDocumentDto(document);
                documentList.add(new ResDocument(
                        documentDto.getId(),
                        cargo.getId(),
                        documentDto.getTitle(),
                        documentDto.getDate(),
                        documentDto.getComment(),
                        documentDto.getAttachments(),
                        cargo.getName(),
                        cargo.getNum()
                ));
            }
        }
        return documentList;
    }

    public DocumentDto getCargoDocument(UUID docId) {
        DocumentEntity documentEntity = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "Id", docId));
        DocumentDto dto = documentService.getDocumentDto(documentEntity);
        repository.findByDocumentListIn(List.of(documentEntity)).ifPresent(cargoEntity -> dto.setOwnerId(cargoEntity.getId()));

        return dto;
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

//            ShippingEntity shippingEntity = shippingRepository.getByCargoEntitiesIn(List.of(entity)).orElse(null);
            if (entity.getShipping() != null) {
                ResShipping resShipping = shippingService.getResShipping(entity.getShipping(), false);
                resCargo.setCarrierName(resShipping.getCarrierName());
                resCargo.setShippingNum(resShipping.getNum());
                resCargo.setShippingStatusId(resShipping.getStatusId());
            }

            list.add(resCargo);
        }

        return list;
    }

    public ResCargo getCargo(CargoEntity entity) {
        ResCargo dto = mapper.toResCargo(entity);
        dto.setOrderId(entity.getOrder().getId());
        dto.setCargoDetails(mapper.toCargoDetailDto(new ArrayList<>(new TreeSet<>(entity.getCargoDetails()))));
        if (entity.getDocumentList() != null && entity.getDocumentList().size() > 0) {
            dto.setDocumentList(documentService.getDocumentDto(entity.getDocumentList()));
        }

        return dto;
    }

    public List<ResDocument> removeDocumentFromCargo(UUID id, UUID docId) {
        CargoEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "id", id));
        DocumentEntity document = documentRepository.findById(docId)
                .orElseThrow(() -> new ResourceNotFoundException("Document", "Id", docId));

        entity.getDocumentList().remove(document);
        repository.saveAndFlush(entity);
        documentService.deleteDocument(document);

        return getCargoDocumentsByOrderId(entity.getOrder().getId());
    }

    public HttpEntity<?> setStatus(CargoStatusDto dto) {
        if (dto.getCargoIdList().size() == 0)
            return ResponseEntity.ok().body(new ApiResponse("Выберите хоть одного груза", false));

        ListEntity listEntity = listRepository.getListItemWithId(dto.getStatusId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", dto.getStatusId()));
        List<CargoEntity> list = repository.findAllById(dto.getCargoIdList());
        for (CargoEntity entity : list) {
            entity.setStatusId(listEntity.getId());
            entity.setStatusName(listEntity.getNameRu());
        }
        repository.saveAll(list);
        return ResponseEntity.ok().body(new ApiResponse("Статусы " + list.size() + " груза изменено успешно", true));
    }

    public List<ExpenseDto> addExpense(ExpenseDto dto){
        CargoEntity cargoEntity = repository.findById(dto.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", dto.getOwnerId()));
        dto.setType(ExpenseType.Cargo);
        ExpenseEntity expense = expenseService.saveAndUpdate(dto);
        cargoEntity.getExpenseList().add(expense);

        cargoEntity = repository.saveAndFlush(cargoEntity);
        return getExpensesByOrderId(cargoEntity.getOrder().getId());
    }

    public List<ExpenseDto> getExpensesByOrderId(UUID orderId) {
        List<ExpenseDto> expenseList = new ArrayList<>();
        List<CargoEntity> cargoList = repository.getAllByOrder_IdAndStateGreaterThanOrderByCreatedAt(orderId, 0);
        for (CargoEntity cargo : cargoList) {
            List<ExpenseDto> dtoList = expenseService.getExpenseDto(cargo.getExpenseList(), cargo.getName());
            if (dtoList.size() > 0)
                expenseList.addAll(dtoList);
        }

        return expenseList;
    }

    public HttpEntity<?> deleteExpenseFromCargo(UUID id) {
        ExpenseEntity expenseEntity = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", id));
        CargoEntity cargoEntity = repository.findById(expenseEntity.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", expenseEntity.getOwnerId()));
        cargoEntity.getExpenseList().remove(expenseEntity);
        repository.saveAndFlush(cargoEntity);
        expenseRepository.delete(expenseEntity);

        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

}
