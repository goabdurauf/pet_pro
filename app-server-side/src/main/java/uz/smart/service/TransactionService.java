package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 16.01.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.TransactionsDto;
import uz.smart.dto.TransactionsInvoicesDto;
import uz.smart.entity.*;
import uz.smart.entity.enums.BalanceType;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.*;
import uz.smart.utils.CommonUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository repository;
    @Autowired
    TransactionsInvoicesRepository trInvRepository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    KassaRepository kassaRepository;
    @Autowired
    CarrierRepository carrierRepository;
    @Autowired
    InvoiceRepository invoiceRepository;
    @Autowired
    BalancesRepository balancesRepository;

    @Autowired
    MapperUtil mapperUtil;

    public HttpEntity<?> saveInTransaction(TransactionsDto dto) {
        TransactionsEntity entity = mapperUtil.toTransactionsEntity(dto, new TransactionsEntity());

        KassaEntity kassa = kassaRepository.findById(dto.getKassaId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "kassaId", dto.getKassaId()));
        entity.setKassa(kassa);

        ListEntity currency = listRepository.findById(dto.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
        entity.setCurrencyName(currency.getNameRu());

        if (dto.getClientId() != null) {
            ClientEntity client = clientRepository.getClientById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "clientId", dto.getClientId()));
            entity.setClient(client);

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(client.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(client.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }

        if (dto.getCarrierId() != null) {
            CarrierEntity carrier = carrierRepository.getCarrierById(dto.getCarrierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "carrierId", dto.getCarrierId()));
            entity.setCarrier(carrier);

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }

        entity = repository.saveAndFlush(entity);

        if (dto.getInvoices() != null && !dto.getInvoices().isEmpty()) {
            for (TransactionsInvoicesDto dtoInvoice : dto.getInvoices()) {
                InvoiceEntity invoice = invoiceRepository.findById(dtoInvoice.getInvoiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dtoInvoice.getInvoiceId()));
                if (invoice.getBalance() == null)
                    invoice.setBalance(BigDecimal.ZERO.subtract(invoice.getFinalPrice()));
                trInvRepository.save(new TransactionsInvoicesEntity(entity.getId(), invoice.getId(), dtoInvoice.getCredit()));
                invoice.setBalance(invoice.getBalance().add(dtoInvoice.getCredit()));
                invoiceRepository.saveAndFlush(invoice);
            }
        }

        kassa.setBalance(kassa.getBalance().add(entity.getPrice()));
        kassaRepository.saveAndFlush(kassa);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> updateInTransaction(TransactionsDto dto) {
        TransactionsEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "Id", dto.getId()));

        KassaEntity kassa = kassaRepository.findById(dto.getKassaId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "kassaId", dto.getKassaId()));
        KassaEntity oldKassa = null;
        if (entity.getKassa().equals(kassa)) {
            kassa.setBalance(kassa.getBalance().subtract(entity.getFinalPrice()).add(dto.getFinalPrice()));
        } else {
            oldKassa = entity.getKassa();
            oldKassa.setBalance(oldKassa.getBalance().subtract(entity.getFinalPrice()));

            kassa.setBalance(kassa.getBalance().add(dto.getFinalPrice()));
        }
        if (entity.getClient() != null) {
            ClientEntity client = entity.getClient();
            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(client.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(client.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }
        if (entity.getCarrier() != null) {
            CarrierEntity carrier = entity.getCarrier();
            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }

        entity = mapperUtil.toTransactionsEntity(dto, entity);
        entity.setKassa(kassa);

        ListEntity currency = listRepository.findById(dto.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
        entity.setCurrencyName(currency.getNameRu());

        if (dto.getClientId() != null) {
            ClientEntity client = clientRepository.getClientById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "clientId", dto.getClientId()));
            entity.setClient(client);

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(client.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(client.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        } else
            entity.setClient(null);

        if (dto.getCarrierId() != null) {
            CarrierEntity carrier = carrierRepository.getCarrierById(dto.getCarrierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "carrierId", dto.getCarrierId()));
            entity.setCarrier(carrier);

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        } else
            entity.setCarrier(null);

        entity = repository.saveAndFlush(entity);

        List<TransactionsInvoicesEntity> allTrInvs = trInvRepository.findAllByTransactionId(entity.getId());
        if (allTrInvs != null && !allTrInvs.isEmpty()) {
            for (TransactionsInvoicesEntity trInv : allTrInvs) {
                InvoiceEntity invoice = invoiceRepository.findById(trInv.getInvoiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", trInv.getInvoiceId()));
                invoice.setBalance(invoice.getBalance().subtract(trInv.getPrice()));
                invoiceRepository.saveAndFlush(invoice);
            }
            trInvRepository.deleteInBatch(allTrInvs);
        }

        if (dto.getInvoices() != null && !dto.getInvoices().isEmpty()) {
            for (TransactionsInvoicesDto dtoInvoice : dto.getInvoices()) {
                InvoiceEntity invoice = invoiceRepository.findById(dtoInvoice.getInvoiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dtoInvoice.getInvoiceId()));
                if (invoice.getBalance() == null)
                    invoice.setBalance(BigDecimal.ZERO.subtract(invoice.getFinalPrice()));
                trInvRepository.save(new TransactionsInvoicesEntity(entity.getId(), invoice.getId(), dtoInvoice.getCredit()));
                invoice.setBalance(invoice.getBalance().add(dtoInvoice.getCredit()));
                invoiceRepository.saveAndFlush(invoice);
            }
        }
        kassaRepository.saveAndFlush(kassa);
        if (oldKassa != null)
            kassaRepository.saveAndFlush(oldKassa);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> saveOutTransaction(TransactionsDto dto) {
        TransactionsEntity entity = mapperUtil.toTransactionsEntity(dto, new TransactionsEntity());
        KassaEntity kassa = kassaRepository.findById(dto.getKassaId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "kassaId", dto.getKassaId()));
        if (kassa.getBalance().compareTo(dto.getFinalPrice()) < 0)
            return ResponseEntity.ok().body(new ApiResponse("Денги не хватает в кассе " + kassa.getName(), false));

        entity.setKassa(kassa);
        if (dto.getCurrencyId() != null) {
            ListEntity currency = listRepository.findById(dto.getCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
            entity.setCurrencyName(currency.getNameRu());
        }
        if (dto.getClientId() != null) {
            ClientEntity client = clientRepository.getClientById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "clientId", dto.getClientId()));
            entity.setClient(client);

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(client.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(client.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }
        if (dto.getCarrierId() != null) {
            CarrierEntity carrier = carrierRepository.getCarrierById(dto.getCarrierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "carrierId", dto.getCarrierId()));
            entity.setCarrier(carrier);

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }

        entity = repository.saveAndFlush(entity);

        if (dto.getInvoices() != null && !dto.getInvoices().isEmpty()) {
            for (TransactionsInvoicesDto dtoInvoice : dto.getInvoices()) {
                InvoiceEntity invoice = invoiceRepository.findById(dtoInvoice.getInvoiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dtoInvoice.getInvoiceId()));
                if (invoice.getBalance() == null)
                    invoice.setBalance(BigDecimal.ZERO.subtract(invoice.getFinalPrice()));
                trInvRepository.save(new TransactionsInvoicesEntity(entity.getId(), invoice.getId(), dtoInvoice.getCredit()));
                invoice.setBalance(invoice.getBalance().add(dtoInvoice.getCredit()));
                invoiceRepository.saveAndFlush(invoice);
            }
        }
        kassa.setBalance(kassa.getBalance().subtract(entity.getFinalPrice()));
        kassaRepository.saveAndFlush(kassa);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> updateOutTransaction(TransactionsDto dto) {
        TransactionsEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "Id", dto.getId()));
        KassaEntity kassa = kassaRepository.findById(dto.getKassaId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "kassaId", dto.getKassaId()));
        KassaEntity oldKassa = null;
        if (entity.getKassa().equals(kassa)) {
            if (kassa.getBalance().add(entity.getFinalPrice()).compareTo(dto.getFinalPrice()) < 0)
                return ResponseEntity.ok().body(new ApiResponse("Денги не хватает в кассе " + kassa.getName(), false));

            kassa.setBalance(kassa.getBalance().add(entity.getFinalPrice()).subtract(dto.getFinalPrice()));
        } else {
            if (kassa.getBalance().compareTo(dto.getFinalPrice()) < 0)
                return ResponseEntity.ok().body(new ApiResponse("Денги не хватает в кассе " + kassa.getName(), false));

            oldKassa = entity.getKassa();
            oldKassa.setBalance(oldKassa.getBalance().add(entity.getFinalPrice()));

            kassa.setBalance(kassa.getBalance().subtract(dto.getFinalPrice()));
        }
        if (entity.getClient() != null) {
            ClientEntity client = entity.getClient();
            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(client.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(client.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }
        if (entity.getCarrier() != null) {
            CarrierEntity carrier = entity.getCarrier();
            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }

        entity = mapperUtil.toTransactionsEntity(dto, entity);
        entity.setKassa(kassa);
        if (dto.getCurrencyId() != null) {
            ListEntity currency = listRepository.findById(dto.getCurrencyId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
            entity.setCurrencyName(currency.getNameRu());
        }
        if (dto.getClientId() != null) {
            ClientEntity client = clientRepository.getClientById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "clientId", dto.getClientId()));
            entity.setClient(client);

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(client.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(client.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        } else
            entity.setClient(null);
        if (dto.getCarrierId() != null) {
            CarrierEntity carrier = carrierRepository.getCarrierById(dto.getCarrierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "carrierId", dto.getCarrierId()));
            entity.setCarrier(carrier);

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        } else
            entity.setCarrier(null);

        entity = repository.saveAndFlush(entity);

        List<TransactionsInvoicesEntity> allTrInvs = trInvRepository.findAllByTransactionId(entity.getId());
        if (allTrInvs != null && !allTrInvs.isEmpty()) {
            for (TransactionsInvoicesEntity trInv : allTrInvs) {
                InvoiceEntity invoice = invoiceRepository.findById(trInv.getInvoiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", trInv.getInvoiceId()));
                invoice.setBalance(invoice.getBalance().subtract(trInv.getPrice()));
                invoiceRepository.saveAndFlush(invoice);
            }
            trInvRepository.deleteInBatch(allTrInvs);
        }

        if (dto.getInvoices() != null && !dto.getInvoices().isEmpty()) {
            for (TransactionsInvoicesDto dtoInvoice : dto.getInvoices()) {
                InvoiceEntity invoice = invoiceRepository.findById(dtoInvoice.getInvoiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dtoInvoice.getInvoiceId()));
                if (invoice.getBalance() == null)
                    invoice.setBalance(BigDecimal.ZERO.subtract(invoice.getFinalPrice()));
                trInvRepository.save(new TransactionsInvoicesEntity(entity.getId(), invoice.getId(), dtoInvoice.getCredit()));
                invoice.setBalance(invoice.getBalance().add(dtoInvoice.getCredit()));
                invoiceRepository.saveAndFlush(invoice);
            }
        }
        kassaRepository.saveAndFlush(kassa);
        if (oldKassa != null)
            kassaRepository.saveAndFlush(oldKassa);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public TransactionsDto getById(UUID id) {
        TransactionsEntity entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "Id", id));
        TransactionsDto dto = mapperUtil.toTransactionDto(entity);
        dto.setKassaId(entity.getKassa().getId());
        dto.setCurrencyInId(entity.getKassa().getCurrencyId());
        dto.setCurrencyInName(entity.getKassa().getCurrencyName());
        if (entity.getClient() != null)
            dto.setClientId(entity.getClient().getId());
        if (entity.getCarrier() != null)
            dto.setCarrierId(entity.getCarrier().getId());

        List<TransactionsInvoicesEntity> trInvList = trInvRepository.findAllByTransactionId(id);
        for (TransactionsInvoicesEntity inv : trInvList) {
            TransactionsInvoicesDto transact = new TransactionsInvoicesDto(inv.getInvoiceId(), inv.getPrice());
            invoiceRepository.findById(inv.getInvoiceId()).ifPresent(invoice -> transact.setDebit(invoice.getBalance().abs()));
            dto.getInvoices().add(transact);
        }

        return dto;
    }

    public TransactionsDto getTransactionDto(TransactionsEntity entity) {
        TransactionsDto dto = mapperUtil.toTransactionDto(entity);
        dto.setKassaId(entity.getKassa().getId());
        dto.setKassaName(entity.getKassa().getName() + " (" + entity.getKassa().getCurrencyName() + ")");
        dto.setCurrencyInId(entity.getKassa().getCurrencyId());
        dto.setCurrencyInName(entity.getKassa().getCurrencyName());
        if (entity.getClient() != null) {
            dto.setClientId(entity.getClient().getId());
            dto.setSourceName(entity.getClient().getName());
        }
        if (entity.getCarrier() != null) {
            dto.setCarrierId(entity.getCarrier().getId());
            dto.setSourceName(entity.getCarrier().getName());
        }
        if (entity.getAgentId() != null) {
            ListEntity agent = listRepository.findById(entity.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent", "Id", entity.getAgentId()));
            dto.setSourceName(agent.getNameRu());
        }

        switch (entity.getKassaType()) {
            case 101 -> {
                dto.setSourceType("От клиента");
                if (trInvRepository.countAllByTransactionId(entity.getId()) > 0)
                    dto.setInvoiceStatus("Выписанный счёт");
            }
            case 102 -> dto.setSourceType("От прочие контрагента");
            case 103 -> dto.setSourceType("От перевозчика (возврат)");
            case 201 -> {
                dto.setSourceType("Перевозчик");
                if (trInvRepository.countAllByTransactionId(entity.getId()) > 0)
                    dto.setInvoiceStatus("Полученный счёт");
            }
            case 202 -> dto.setSourceType("Возврат клиенту");
            case 203 -> dto.setSourceType("Прочие расходы");
        }

        return dto;
    }

    public List<TransactionsDto> getTransactionList() {
        List<TransactionsEntity> entityList = repository.findAll();
        List<TransactionsDto> dtoList = new ArrayList<>();
        for (TransactionsEntity entity : entityList) {
            dtoList.add(getTransactionDto(entity));
        }

        return dtoList;
    }

    public String getNextNum() {
        Optional<TransactionsEntity> optional = repository.getFirstByOrderByCreatedAtDesc();
        return "20" + optional.map(entity -> CommonUtils.generateNextNum("", entity.getNum().contains("-") ? entity.getNum() : ""))
                .orElseGet(() -> CommonUtils.generateNextNum("", ""));
    }
}
