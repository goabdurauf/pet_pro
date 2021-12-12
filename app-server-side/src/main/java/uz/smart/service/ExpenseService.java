package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 12.12.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.smart.dto.ExpenseDto;
import uz.smart.entity.CarrierEntity;
import uz.smart.entity.ExpenseEntity;
import uz.smart.entity.ListEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.repository.CarrierRepository;
import uz.smart.repository.ExpenseRepository;
import uz.smart.repository.ListRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ExpenseService {

    @Autowired
    ExpenseRepository repository;
    @Autowired
    CarrierRepository carrierRepository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    MapperUtil mapperUtil;

    public ExpenseEntity saveAndUpdate(ExpenseDto dto) {
        ExpenseEntity entity = dto.getId() == null
                ? mapperUtil.toExpenseEntity(dto, new ExpenseEntity())
                : mapperUtil.toExpenseEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", dto.getId())));

        CarrierEntity carrier = carrierRepository.findById(dto.getCarrierId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrier", "Id", dto.getId()));
        entity.setCarrier(carrier);

        if (dto.getFromCurrencyId() != null) {
            ListEntity fromCurrency = listRepository.findById(dto.getFromCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "fromCurrencyId", dto.getFromCurrencyId()));
            entity.setFromCurrencyName(fromCurrency.getNameRu());
        }
        if (dto.getToCurrencyId() != null) {
            ListEntity toCurrency = listRepository.findById(dto.getToCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "toCurrencyId", dto.getToCurrencyId()));
            entity.setToCurrencyName(toCurrency.getNameRu());
        }

        return repository.saveAndFlush(entity);
    }

    public List<ExpenseDto> getExpenseDto(Set<ExpenseEntity> entities, String ownerName){
        List<ExpenseDto> list = new ArrayList<>();
        if (entities == null || entities.size() == 0)
            return list;

        for (ExpenseEntity entity : entities) {
            list.add(getExpenseDto(entity, ownerName));
        }

        return list;
    }

    public ExpenseDto getExpenseDto(UUID id){
        return getExpenseDto(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", id)), "");
    }

    public ExpenseDto getExpenseDto(ExpenseEntity entity, String ownerName){
        ExpenseDto dto = mapperUtil.toExpenseDto(entity);
        dto.setOwnerName(ownerName);
        if (entity.getCarrier() != null){
            dto.setCarrierId(entity.getCarrier().getId());
            dto.setCarrierName(entity.getCarrier().getName());
        }
        return dto;
    }

    public void deleteExpense(List<UUID> idList) {
        for (UUID id : idList) {
            deleteExpense(id);
        }
    }

    public void deleteExpense(UUID id) {
        repository.deleteById(id);
    }
}
