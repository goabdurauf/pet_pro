package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 16.01.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import uz.smart.dto.TransactionsDto;
import uz.smart.dto.TransactionsInvoicesDto;
import uz.smart.entity.*;
import uz.smart.entity.enums.BalanceType;
import uz.smart.entity.enums.VerificationType;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ReqTransactionSearch;
import uz.smart.payload.ResPageable;
import uz.smart.repository.*;
import uz.smart.utils.AppConstants;
import uz.smart.utils.CommonUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

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
    VerificationActRepository verificationActRepository;

    @Autowired
    MapperUtil mapperUtil;
    private final SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");


    public HttpEntity<?> saveInTransaction(TransactionsDto dto) {
        TransactionsEntity entity = mapperUtil.toTransactionsEntity(dto, new TransactionsEntity());
        VerificationActEntity verAct = new VerificationActEntity();
        verAct.setType(
                switch (dto.getKassaType()) {
                    case 101 -> VerificationType.ClientIn;
                    case 102 -> VerificationType.AgentIn;
                    case 103 -> VerificationType.CarrierIn;
                    default -> null;
                }
        );

        KassaEntity kassa = kassaRepository.findById(dto.getKassaId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "kassaId", dto.getKassaId()));
        entity.setKassa(kassa);

        ListEntity currency = listRepository.findById(dto.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
        entity.setCurrencyName(currency.getNameRu());
        verAct.setCurrencyId(currency.getId());

        if (dto.getClientId() != null) {
            ClientEntity client = clientRepository.getClientById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "clientId", dto.getClientId()));
            entity.setClient(client);
            verAct.setOwnerId(client.getId());

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(client.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(client.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }

        if (dto.getCarrierId() != null) {
            CarrierEntity carrier = carrierRepository.getCarrierById(dto.getCarrierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "carrierId", dto.getCarrierId()));
            entity.setCarrier(carrier);
            verAct.setOwnerId(carrier.getId());

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }

        if (verAct.getType() == VerificationType.AgentIn) {
            ListEntity agent = listRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "agentId", dto.getAgentId()));
            if (!StringUtils.hasText(agent.getVal01())) {
                agent.setVal01(UUID.randomUUID().toString());
                listRepository.saveAndFlush(agent);
            }

            verAct.setOwnerId(UUID.fromString(agent.getVal01()));
        }

        entity = repository.saveAndFlush(entity);

        if (dto.getInvoices() != null && !dto.getInvoices().isEmpty()) {
            for (TransactionsInvoicesDto dtoInvoice : dto.getInvoices()) {
                InvoiceEntity invoice = invoiceRepository.findById(dtoInvoice.getInvoiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dtoInvoice.getInvoiceId()));
                if (invoice.getBalance() == null)
                    invoice.setBalance(BigDecimal.ZERO.subtract(invoice.getFinalPrice()));
                trInvRepository.save(new TransactionsInvoicesEntity(entity.getId(), invoice.getId(), dtoInvoice.getCredit(), dtoInvoice.getRate(),
                        dtoInvoice.getRate() != null && !dtoInvoice.getRate().equals(BigDecimal.ZERO)
                                ? dtoInvoice.getCredit().divide(dtoInvoice.getRate(), RoundingMode.HALF_EVEN) : BigDecimal.ZERO,
                        dto.getKassaType()
                        ));
                invoice.setBalance(invoice.getBalance().add(dtoInvoice.getCredit()));
                invoiceRepository.saveAndFlush(invoice);
            }
        }

        kassa.setBalance(kassa.getBalance().add(entity.getPrice()));
        kassaRepository.saveAndFlush(kassa);

        verAct.setDocId(entity.getId());
        verAct.setDate(entity.getDate());
        verificationActRepository.saveAndFlush(verAct);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> updateInTransaction(TransactionsDto dto) {
        TransactionsEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "Id", dto.getId()));
        VerificationActEntity verAct = verificationActRepository.findByDocId(entity.getId()).orElse(new VerificationActEntity());
        verAct.setDocId(entity.getId());
        verAct.setType(
                switch (dto.getKassaType()) {
                    case 101 -> VerificationType.ClientIn;
                    case 102 -> VerificationType.AgentIn;
                    case 103 -> VerificationType.CarrierIn;
                    default -> null;
                }
        );

        KassaEntity kassa = kassaRepository.findById(dto.getKassaId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "kassaId", dto.getKassaId()));
        KassaEntity oldKassa = null;
        if (entity.getKassa().equals(kassa)) {
            kassa.setBalance(kassa.getBalance().subtract(entity.getPrice()).add(dto.getPrice()));
        } else {
            oldKassa = entity.getKassa();
            oldKassa.setBalance(oldKassa.getBalance().subtract(entity.getPrice()));

            kassa.setBalance(kassa.getBalance().add(dto.getPrice()));
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
        verAct.setCurrencyId(currency.getId());

        if (dto.getClientId() != null) {
            ClientEntity client = clientRepository.getClientById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "clientId", dto.getClientId()));
            entity.setClient(client);
            verAct.setOwnerId(client.getId());

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
            verAct.setOwnerId(carrier.getId());

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        } else
            entity.setCarrier(null);

        if (verAct.getType() == VerificationType.AgentIn) {
            ListEntity agent = listRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "agentId", dto.getAgentId()));
            if (!StringUtils.hasText(agent.getVal01())) {
                agent.setVal01(UUID.randomUUID().toString());
                listRepository.saveAndFlush(agent);
            }

            verAct.setOwnerId(UUID.fromString(agent.getVal01()));
        }

        entity = repository.saveAndFlush(entity);

        verAct.setDate(entity.getDate());
        verificationActRepository.saveAndFlush(verAct);

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
                trInvRepository.save(new TransactionsInvoicesEntity(entity.getId(), invoice.getId(), dtoInvoice.getCredit(), dtoInvoice.getRate(),
                        dtoInvoice.getRate() != null && !dtoInvoice.getRate().equals(BigDecimal.ZERO)
                                ? dtoInvoice.getCredit().divide(dtoInvoice.getRate(), RoundingMode.HALF_EVEN) : BigDecimal.ZERO,
                        dto.getKassaType()
                ));
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
        VerificationActEntity verAct = new VerificationActEntity();
        verAct.setType(
                switch (dto.getKassaType()) {
                    case 201 -> VerificationType.CarrierOut;
                    case 202 -> VerificationType.ClientOut;
                    case 203 -> VerificationType.OthersOut;
                    default -> null;
                }
        );

        KassaEntity kassa = kassaRepository.findById(dto.getKassaId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "kassaId", dto.getKassaId()));
        if (kassa.getBalance().compareTo(dto.getPrice()) < 0)
            return ResponseEntity.ok().body(new ApiResponse("Денги не хватает в кассе " + kassa.getName(), false));

        entity.setKassa(kassa);
        ListEntity currency = listRepository.findById(dto.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
        entity.setCurrencyName(currency.getNameRu());
        verAct.setCurrencyId(currency.getId());

        if (dto.getClientId() != null) {
            ClientEntity client = clientRepository.getClientById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "clientId", dto.getClientId()));
            entity.setClient(client);
            verAct.setOwnerId(client.getId());

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(client.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(client.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Client));
            bEntity.setBalance(bEntity.getBalance().add(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }
        if (dto.getCarrierId() != null) {
            CarrierEntity carrier = carrierRepository.getCarrierById(dto.getCarrierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "carrierId", dto.getCarrierId()));
            entity.setCarrier(carrier);
            verAct.setOwnerId(carrier.getId());

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        }

        if (verAct.getType() == VerificationType.OthersOut) {
            ListEntity agent = listRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "agentId", dto.getAgentId()));
            if (!StringUtils.hasText(agent.getVal01())) {
                agent.setVal01(UUID.randomUUID().toString());
                listRepository.saveAndFlush(agent);
            }

            verAct.setOwnerId(UUID.fromString(agent.getVal01()));
        }

        entity = repository.saveAndFlush(entity);

        if (dto.getInvoices() != null && !dto.getInvoices().isEmpty()) {
            for (TransactionsInvoicesDto dtoInvoice : dto.getInvoices()) {
                InvoiceEntity invoice = invoiceRepository.findById(dtoInvoice.getInvoiceId())
                        .orElseThrow(() -> new ResourceNotFoundException("Invoice", "Id", dtoInvoice.getInvoiceId()));
                if (invoice.getBalance() == null)
                    invoice.setBalance(BigDecimal.ZERO.subtract(invoice.getFinalPrice()));
                trInvRepository.save(new TransactionsInvoicesEntity(entity.getId(), invoice.getId(), dtoInvoice.getCredit(), dtoInvoice.getRate(),
                        dtoInvoice.getRate() != null && !dtoInvoice.getRate().equals(BigDecimal.ZERO)
                                ? dtoInvoice.getCredit().divide(dtoInvoice.getRate(), RoundingMode.HALF_EVEN) : BigDecimal.ZERO,
                        dto.getKassaType()
                ));
                invoice.setBalance(invoice.getBalance().add(dtoInvoice.getCredit()));
                invoiceRepository.saveAndFlush(invoice);
            }
        }
        kassa.setBalance(kassa.getBalance().subtract(entity.getPrice()));
        kassaRepository.saveAndFlush(kassa);

        verAct.setDocId(entity.getId());
        verAct.setDate(entity.getDate());
        verificationActRepository.saveAndFlush(verAct);

        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> updateOutTransaction(TransactionsDto dto) {
        TransactionsEntity entity = repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "Id", dto.getId()));
        VerificationActEntity verAct = verificationActRepository.findByDocId(entity.getId()).orElse(new VerificationActEntity());
        verAct.setDocId(entity.getId());
        verAct.setType(
                switch (dto.getKassaType()) {
                    case 201 -> VerificationType.CarrierOut;
                    case 202 -> VerificationType.ClientOut;
                    case 203 -> VerificationType.OthersOut;
                    default -> null;
                }
        );

        KassaEntity kassa = kassaRepository.findById(dto.getKassaId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", "kassaId", dto.getKassaId()));
        KassaEntity oldKassa = null;
        if (entity.getKassa().equals(kassa)) {
            if (kassa.getBalance().add(entity.getPrice()).compareTo(dto.getPrice()) < 0)
                return ResponseEntity.ok().body(new ApiResponse("Денги не хватает в кассе " + kassa.getName(), false));

            kassa.setBalance(kassa.getBalance().add(entity.getPrice()).subtract(dto.getPrice()));
        } else {
            if (kassa.getBalance().compareTo(dto.getPrice()) < 0)
                return ResponseEntity.ok().body(new ApiResponse("Денги не хватает в кассе " + kassa.getName(), false));

            oldKassa = entity.getKassa();
            oldKassa.setBalance(oldKassa.getBalance().add(entity.getPrice()));

            kassa.setBalance(kassa.getBalance().subtract(dto.getPrice()));
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
        ListEntity currency = listRepository.findById(dto.getCurrencyId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "currencyId", dto.getCurrencyId()));
        entity.setCurrencyName(currency.getNameRu());
        verAct.setCurrencyId(currency.getId());

        if (dto.getClientId() != null) {
            ClientEntity client = clientRepository.getClientById(dto.getClientId())
                    .orElseThrow(() -> new ResourceNotFoundException("Transaction", "clientId", dto.getClientId()));
            entity.setClient(client);
            verAct.setOwnerId(client.getId());

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
            verAct.setOwnerId(carrier.getId());

            BalancesEntity bEntity = balancesRepository.findById(new BalancesEntityPK(carrier.getId(), entity.getCurrencyId()))
                    .orElse(new BalancesEntity(carrier.getId(), entity.getCurrencyId(), entity.getCurrencyName(), BalanceType.Carrier));
            bEntity.setBalance(bEntity.getBalance().subtract(entity.getFinalPrice()));
            balancesRepository.save(bEntity);
        } else
            entity.setCarrier(null);

        if (verAct.getType() == VerificationType.OthersOut) {
            ListEntity agent = listRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new ResourceNotFoundException("List", "agentId", dto.getAgentId()));
            if (!StringUtils.hasText(agent.getVal01())) {
                agent.setVal01(UUID.randomUUID().toString());
                listRepository.saveAndFlush(agent);
            }

            verAct.setOwnerId(UUID.fromString(agent.getVal01()));
        }

        entity = repository.saveAndFlush(entity);

        verAct.setDate(entity.getDate());
        verificationActRepository.saveAndFlush(verAct);

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
                trInvRepository.save(new TransactionsInvoicesEntity(entity.getId(), invoice.getId(), dtoInvoice.getCredit(), dtoInvoice.getRate(),
                        dtoInvoice.getRate() != null && !dtoInvoice.getRate().equals(BigDecimal.ZERO)
                                ? dtoInvoice.getCredit().divide(dtoInvoice.getRate(), RoundingMode.HALF_EVEN) : BigDecimal.ZERO,
                        dto.getKassaType()
                ));
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
            TransactionsInvoicesDto transact = new TransactionsInvoicesDto(inv.getInvoiceId(), inv.getPrice(), inv.getRate(), inv.getFinalPrice());
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

    public HttpEntity<?> getTransactionByFilter(ReqTransactionSearch req) {
        Set<TransactionsEntity> entityList;
        List<TransactionsDto> dtoList = new ArrayList<>();
        long totalElement = 0;
        req.setKassaInType(req.getKassaType() != null && req.getKassaType() == 100 ? req.getKassaInType() : null);
        req.setKassaOutType(req.getKassaType() != null && req.getKassaType() == 200 ? req.getKassaOutType() : null);
        try {
            entityList = repository.getTransactionsByFilter(
                    new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
                    new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.END_DATE).getTime()),
                    req.getKassaType() != null ? req.getKassaType() : 100,
                    req.getKassaType() != null ? req.getKassaType() + 100 : 300,
                    req.getKassaInType() != null ? req.getKassaInType() : req.getKassaOutType(),
                    req.getClientId(), req.getCarrierId(), req.getKassaId(), req.getAgentId(),
                    req.getPage() * req.getSize(), req.getSize());
            totalElement = repository.getTransactionsCount(
                    new Timestamp(format.parse(req.getStart() != null ? req.getStart() : AppConstants.BEGIN_DATE).getTime()),
                    new Timestamp(format.parse(req.getEnd() != null ? req.getEnd() : AppConstants.END_DATE).getTime()),
                    req.getKassaType() != null ? req.getKassaType() : 100,
                    req.getKassaType() != null ? req.getKassaType() + 100 : 300,
                    req.getKassaInType() != null ? req.getKassaInType() : req.getKassaOutType(),
                    req.getClientId(), req.getCarrierId(), req.getKassaId(), req.getAgentId());
        } catch (ParseException e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ResPageable(new ArrayList<>(), totalElement, req.getPage()));
        }

        for (TransactionsEntity entity : entityList) {
            dtoList.add(getTransactionDto(entity));
        }

        return ResponseEntity.ok(new ResPageable(dtoList, totalElement, req.getPage()));
    }

    public String getNextNum() {
        Optional<TransactionsEntity> optional = repository.getFirstByOrderByCreatedAtDesc();
        return "20" + optional.map(entity -> CommonUtils.generateNextNum("", entity.getNum().contains("-") ? entity.getNum() : ""))
                .orElseGet(() -> CommonUtils.generateNextNum("", ""));
    }


}
