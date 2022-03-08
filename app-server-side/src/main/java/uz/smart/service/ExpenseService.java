package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 12.12.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.smart.dto.ExpenseDto;
import uz.smart.entity.*;
import uz.smart.entity.enums.ExpenseType;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ResDividedExpense;
import uz.smart.payload.ResInvoice;
import uz.smart.repository.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ExpenseService {

    @Autowired
    ExpenseRepository repository;
    @Autowired
    CargoRepository cargoRepository;
    @Autowired
    CarrierRepository carrierRepository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    ClientRepository clientRepository;
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

        if (dto.getNameId() != null) {
            ListEntity expName = listRepository.findById(dto.getNameId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "nameId", dto.getNameId()));
            entity.setName(expName.getNameRu());
        }
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

    public ExpenseEntity update(ExpenseDto dto) {
        ExpenseEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", dto.getId()));
        CarrierEntity carrier = carrierRepository.findById(dto.getCarrierId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrier", "Id", dto.getId()));
        entity.setCarrier(carrier);

        if (dto.getNameId() != null) {
            ListEntity expName = listRepository.findById(dto.getNameId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "nameId", dto.getNameId()));
            entity.setName(expName.getNameRu());
        }
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
        entity.setName(dto.getName());
        entity.setFromPrice(dto.getFromPrice());
        entity.setFromRate(dto.getFromRate());
        entity.setFromFinalPrice(dto.getFromFinalPrice());
        entity.setToPrice(dto.getToPrice());
        entity.setToRate(dto.getToRate());
        entity.setToFinalPrice(dto.getToFinalPrice());
        entity.setComment(dto.getComment());

        return repository.saveAndFlush(entity);
    }

    public List<ExpenseDto> getExpenseDto(Set<ExpenseEntity> entities, String ownerName, String ownerNum){
        List<ExpenseDto> list = new ArrayList<>();
        if (entities == null || entities.size() == 0)
            return list;

        for (ExpenseEntity entity : entities) {
            list.add(getExpenseDto(entity, ownerName, ownerNum));
        }

        return list;
    }

    public ExpenseDto getExpenseDto(UUID id){
        return getExpenseDto(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", id)), "", "");
    }

    public ResInvoice getForInvoice(UUID id) {
        ExpenseEntity expense = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", id));
        ResInvoice dto = new ResInvoice();
        dto.setExpenseId(expense.getId());
        dto.setPrice(expense.getToPrice());
        dto.setRate(expense.getToRate());
        dto.setFinalPrice(expense.getToFinalPrice());
        dto.setCurrencyId(expense.getToCurrencyId());
        dto.setComment(expense.getComment());
        dto.setCarrierName(expense.getCarrier().getName());

        if (expense.getType().equals(ExpenseType.Cargo)) {
            CargoEntity cargo = cargoRepository.getCargoById(expense.getOwnerId()).orElse(new CargoEntity());
            ClientEntity client = clientRepository.getClientById(cargo.getOrder().getClientId()).orElse(new ClientEntity());
            dto.setClientName(client.getName());
        }
        return dto;
    }

    public ResInvoice getForInvoiceIn(UUID id) {
        ExpenseEntity expense = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "Id", id));
        ResInvoice dto = new ResInvoice();
        dto.setExpenseId(expense.getId());
        dto.setPrice(expense.getFromPrice());
        dto.setRate(expense.getFromRate());
        dto.setFinalPrice(expense.getFromFinalPrice());
        dto.setCurrencyId(expense.getFromCurrencyId());
        dto.setComment(expense.getComment());
        dto.setCarrierName(expense.getCarrier().getName());

        if (expense.getType().equals(ExpenseType.Cargo)) {
            CargoEntity cargo = cargoRepository.getCargoById(expense.getOwnerId()).orElse(new CargoEntity());
            ClientEntity client = clientRepository.getClientById(cargo.getOrder().getClientId()).orElse(new ClientEntity());
            dto.setClientName(client.getName());
        }
        return dto;
    }

    public ExpenseDto getExpenseDto(ExpenseEntity entity, String ownerName, String ownerNum){
        ExpenseDto dto = mapperUtil.toExpenseDto(entity);
        dto.setOwnerName(ownerName);
        dto.setOwnerNum(ownerNum);
        if (entity.getCarrier() != null){
            dto.setCarrierId(entity.getCarrier().getId());
            dto.setCarrierName(entity.getCarrier().getName());
        }

        List<ExpenseEntity> dividedExpenses = repository.findAllByOldId(entity.getId());
        if (dividedExpenses != null && dividedExpenses.size() > 0) {
            for (ExpenseEntity divided : dividedExpenses) {
                CargoEntity cargo = cargoRepository.findById(divided.getOwnerId())
                        .orElseThrow(() -> new ResourceNotFoundException("Cargo", "Id", divided.getOwnerId()));
                dto.getDividedExpenseList().add(new ResDividedExpense(divided.getId(), cargo.getName(), cargo.getNum(), divided.getToFinalPrice()));
            }
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
