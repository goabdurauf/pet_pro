package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 25.11.2021.
*/

import org.springframework.http.HttpEntity;
import uz.smart.dto.DocumentDto;
import uz.smart.dto.ShippingDto;
import uz.smart.entity.ShippingEntity;
import uz.smart.payload.ResShipping;

import java.util.List;
import java.util.UUID;

public interface ShippingService {

    HttpEntity<?> saveAndUpdateShipping(ShippingDto dto);

    HttpEntity<?> deleteShipping(UUID id);

    ShippingDto getShipping(UUID id);

    List<ResShipping> getShippingListByOrderId(UUID id);

    List<ResShipping> getShippingList();

    ResShipping getResShipping(UUID id);

    ResShipping getResShipping(ShippingEntity entity, boolean hasDetails);

    HttpEntity<?> removeCargoById(UUID shippingId, UUID cargoId);

    List<DocumentDto> addDocument(DocumentDto dto);

    List<DocumentDto> removeDocumentById(UUID shippingId, UUID docId);

}
