package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.smart.dto.*;
import uz.smart.entity.*;
import uz.smart.entity.enums.BalanceType;
import uz.smart.entity.template.AbsEntity;
import uz.smart.payload.ResInvoice;
import uz.smart.payload.ResShippingIncome;
import uz.smart.payload.ResVerificationAct;
import uz.smart.repository.*;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BalancesService {

    @Autowired
    BalancesRepository repository;
    @Autowired
    ClientRepository clientRepository;
    @Autowired
    CarrierRepository carrierRepository;
    @Autowired
    ListRepository listRepository;
    @Autowired
    VerificationActRepository verificationActRepository;
    @Autowired
    InvoiceRepository invoiceRepository;
    @Autowired
    TransactionRepository transactionRepository;
    @Autowired
    TransactionsInvoicesRepository trInvRepository;
    @Autowired
    ShippingRepository shippingRepository;

    @Autowired
    InvoiceService invoiceService;
    @Autowired
    TransactionService transactionService;

    private final SimpleDateFormat format = new SimpleDateFormat("dd.MM.yyyy");

    public BalancesTotalDto getClientBalances() {
        BalancesTotalDto dto = new BalancesTotalDto();
        List<ClientEntity> clients = clientRepository.getAllClients();
        for (ClientEntity client : clients) {
            dto.getAgents().addAll(getBalanceDto(client.getName(), repository.getAllByOwnerId(client.getId())));
        }

        List<ListEntity> currencyList = listRepository.getListByType(4);
        currencyList.forEach(currency -> {
            BigDecimal balance = repository.getBalanceByCurrencyAndType(currency.getId(), BalanceType.Client, new Date());
            dto.getCurrencies().add(new BalancesCurrencyDto(currency.getId(), currency.getNameRu(), balance != null ? balance : BigDecimal.ZERO));
        });

        return dto;
    }

    public BalancesTotalDto getCarrierBalances() {
        BalancesTotalDto dto = new BalancesTotalDto();
        List<CarrierEntity> carriers = carrierRepository.getAllCarriers();
        for (CarrierEntity carrier : carriers) {
            dto.getAgents().addAll(getBalanceDto(carrier.getName(), repository.getAllByOwnerId(carrier.getId())));
        }

        List<ListEntity> currencyList = listRepository.getListByType(4);
        if (currencyList != null && currencyList.size() > 0) {
            currencyList.forEach(currency -> {
                BigDecimal balance = repository.getBalanceByCurrencyAndType(currency.getId(), BalanceType.Carrier, new Date());
                dto.getCurrencies().add(new BalancesCurrencyDto(currency.getId(), currency.getNameRu(), balance != null ? balance : BigDecimal.ZERO));
            });
        }
        return dto;
    }

    private List<BalancesDto> getBalanceDto(String ownerName, List<BalancesEntity> entityList) {
        List<BalancesDto> dtoList = new ArrayList<>();
        entityList.forEach(entity -> dtoList.add(new BalancesDto( entity.getOwnerId().toString() + entity.getCurrencyId(), ownerName, entity.getCurrencyName(), entity.getBalance())));
        return dtoList;
    }

    public List<BalancesForBar> getBalanceByDate(Date date) {
        List<BalancesForBar> res = new ArrayList<>();
        List<ListEntity> currencyList = listRepository.getListByType(4);
        if (currencyList != null && currencyList.size() > 0) {
            currencyList.forEach(currency -> {
                BigDecimal carrier = repository.getBalanceByCurrencyAndType(currency.getId(), BalanceType.Carrier, date);
                BigDecimal client = repository.getBalanceByCurrencyAndType(currency.getId(), BalanceType.Client, date);
                res.add(new BalancesForBar(
                        currency.getNameRu(),
                        client != null ? client : BigDecimal.ZERO,
                        carrier != null ? carrier : BigDecimal.ZERO,
                        BigDecimal.valueOf(2124)
                ));
            });
        }
        return res;
    }

    public List<ResVerificationAct> getCarrierVerActs() {
        List<ResVerificationAct> resList = new ArrayList<>();
        List<CarrierEntity> carriers = carrierRepository.getAllCarriers();
        carriers.forEach(carrier -> {
            ResVerificationAct act = new ResVerificationAct(carrier.getName());
            List<ListEntity> currencyList = listRepository.getListByType(4);
            currencyList.forEach(currency -> {
                List<VerificationActDto> dtoList = new ArrayList<>();
                VerificationActDto total = new VerificationActDto(
                        UUID.randomUUID(),
                        true,
                        carrier.getName(),
                        currency.getNameRu(),
                        BigDecimal.ZERO
                );

                List<VerificationActEntity> verificationActList = verificationActRepository.findAllByOwnerIdAndCurrencyIdOrderByDate(carrier.getId(), currency.getId());
                verificationActList.forEach(verAct -> {
                    VerificationActDto dto = new VerificationActDto();
                    dto.setOwnerName(carrier.getName());
                    dto.setCurrencyName(currency.getNameRu());
                    switch (verAct.getType()) {
                        case InvoiceIn -> {
                            InvoiceEntity invoice = invoiceRepository.findById(verAct.getDocId()).orElse(null);
                            if (invoice != null) {
                                ResInvoice resInvoice = invoiceService.getResInvoice(invoice);
                                dto.setId(invoice.getId());
                                dto.setName("полученный счёт " + invoice.getNum() + " от " + format.format(invoice.getCreatedAt()));
                                dto.setServiceName(resInvoice.getName());
                                dto.setShippingNum(resInvoice.getShipNum());
                                dto.setTransportNum(resInvoice.getTransportNum());
                                dto.setDebitSum(resInvoice.getPrice());
                                dto.setRate(resInvoice.getRate());
                                dto.setDebitFinalSum(resInvoice.getFinalPrice());

                                total.setDebitSum(total.getDebitSum().add(resInvoice.getPrice()));
                                total.setDebitFinalSum(total.getDebitFinalSum().add(resInvoice.getFinalPrice()));
                            }
                        }
                        case CarrierIn -> {
                            TransactionsEntity entity = transactionRepository.findById(verAct.getDocId()).orElse(null);
                            if (entity != null) {
                                TransactionsDto transactionDto = transactionService.getTransactionDto(entity);
                                dto.setId(entity.getId());
                                dto.setName(("приход в кассу " + transactionDto.getNum() + " от " + format.format(transactionDto.getDate())));
                                dto.setServiceName(transactionDto.getSourceType());
                                dto.setDebitSum(transactionDto.getPrice());
                                dto.setRate(transactionDto.getRate());
                                dto.setDebitFinalSum(transactionDto.getFinalPrice());

                                total.setDebitSum(total.getDebitSum().add(transactionDto.getPrice()));
                                total.setDebitFinalSum(total.getDebitFinalSum().add(transactionDto.getFinalPrice()));
                            }
                        }
                        case CarrierOut -> {
                            TransactionsEntity entity = transactionRepository.findById(verAct.getDocId()).orElse(null);
                            if (entity != null) {
                                TransactionsDto transactionDto = transactionService.getTransactionDto(entity);
                                dto.setId(entity.getId());
                                dto.setName(("расход из кассы " + transactionDto.getNum() + " от " + format.format(transactionDto.getDate())));
                                dto.setServiceName(transactionDto.getSourceType());
                                dto.setCreditSum(transactionDto.getPrice());
                                dto.setRate(transactionDto.getRate());
                                dto.setCreditFinalSum(transactionDto.getFinalPrice());

                                total.setCreditSum(total.getCreditSum().add(transactionDto.getPrice()));
                                total.setCreditFinalSum(total.getCreditFinalSum().add(transactionDto.getFinalPrice()));
                            }
                        }
                    }
                    dtoList.add(dto);
                });
                if (dtoList.size() > 0) {
                    dtoList.add(0, total);
                    act.getActList().add(dtoList);
                }
            });
            resList.add(act);
        });

        return resList;
    }

    public List<ResVerificationAct> getClientVerActs() {
        List<ResVerificationAct> resList = new ArrayList<>();
        List<ClientEntity> clients = clientRepository.getAllClients();
        clients.forEach(client -> {
            ResVerificationAct act = new ResVerificationAct(client.getName());
            List<ListEntity> currencyList = listRepository.getListByType(4);
            currencyList.forEach(currency -> {
                List<VerificationActDto> dtoList = new ArrayList<>();
                VerificationActDto total = new VerificationActDto(
                        UUID.randomUUID(),
                        true,
                        client.getName(),
                        currency.getNameRu(),
                        BigDecimal.ZERO
                );

                List<VerificationActEntity> verificationActList = verificationActRepository.findAllByOwnerIdAndCurrencyIdOrderByDate(client.getId(), currency.getId());
                verificationActList.forEach(verAct -> {
                    VerificationActDto dto = new VerificationActDto();
                    dto.setOwnerName(client.getName());
                    dto.setCurrencyName(currency.getNameRu());
                    switch (verAct.getType()) {
                        case InvoiceOut -> {
                            InvoiceEntity invoice = invoiceRepository.findById(verAct.getDocId()).orElse(null);
                            if (invoice != null) {
                                ResInvoice resInvoice = invoiceService.getResInvoice(invoice);
                                dto.setId(invoice.getId());
                                dto.setName("выписанный счёт " + invoice.getNum() + " от " + format.format(invoice.getCreatedAt()));
                                dto.setServiceName(resInvoice.getName());
                                dto.setShippingNum(resInvoice.getShipNum());
                                dto.setTransportNum(resInvoice.getTransportNum());
                                dto.setDebitSum(resInvoice.getPrice());
                                dto.setRate(resInvoice.getRate());
                                dto.setDebitFinalSum(resInvoice.getFinalPrice());

                                total.setDebitSum(total.getDebitSum().add(resInvoice.getPrice()));
                                total.setDebitFinalSum(total.getDebitFinalSum().add(resInvoice.getFinalPrice()));
                            }
                        }
                        case ClientIn -> {
                            TransactionsEntity entity = transactionRepository.findById(verAct.getDocId()).orElse(null);
                            if (entity != null) {
                                TransactionsDto transactionDto = transactionService.getTransactionDto(entity);
                                dto.setId(entity.getId());
                                dto.setName(("приход в кассу " + transactionDto.getNum() + " от " + format.format(transactionDto.getDate())));
                                dto.setServiceName(transactionDto.getSourceType());
                                dto.setCreditSum(transactionDto.getPrice());
                                dto.setRate(transactionDto.getRate());
                                dto.setCreditFinalSum(transactionDto.getFinalPrice());

                                total.setCreditSum(total.getCreditSum().add(transactionDto.getPrice()));
                                total.setCreditFinalSum(total.getCreditFinalSum().add(transactionDto.getFinalPrice()));
                            }
                        }
                        case ClientOut -> {
                            TransactionsEntity entity = transactionRepository.findById(verAct.getDocId()).orElse(null);
                            if (entity != null) {
                                TransactionsDto transactionDto = transactionService.getTransactionDto(entity);
                                dto.setId(entity.getId());
                                dto.setName(("расход из кассы " + transactionDto.getNum() + " от " + format.format(transactionDto.getDate())));
                                dto.setServiceName(transactionDto.getSourceType());
                                dto.setDebitSum(transactionDto.getPrice());
                                dto.setRate(transactionDto.getRate());
                                dto.setDebitFinalSum(transactionDto.getFinalPrice());

                                total.setDebitSum(total.getDebitSum().add(transactionDto.getPrice()));
                                total.setDebitFinalSum(total.getDebitFinalSum().add(transactionDto.getFinalPrice()));
                            }
                        }

                    }
                    dtoList.add(dto);
                });
                if (dtoList.size() > 0) {
                    dtoList.add(0, total);
                    act.getActList().add(dtoList);
                }
            });
            resList.add(act);
        });

        return resList;
    }

    public List<List<ResShippingIncome>> getShippingIncomeList() {
        List<List<ResShippingIncome>> resList = new ArrayList<>();
        List<ShippingEntity> shippingList = shippingRepository.getAllShipping();
        shippingList.forEach(shipping -> {
            List<ResShippingIncome> res = new ArrayList<>();
            List<UUID> shippingInvoiceIdList = invoiceRepository.findAllByShipping(shipping).stream().map(AbsEntity::getId).collect(Collectors.toList());
            List<TransactionsInvoicesEntity> shippingTransactionList = trInvRepository.findAllByInvoiceIdInAndKassaTypeIn(shippingInvoiceIdList, List.of(201));
            for (TransactionsInvoicesEntity trInvoice : shippingTransactionList) {
                TransactionsEntity transactionsEntity = transactionRepository.findById(trInvoice.getTransactionId()).orElse(null);
                if (transactionsEntity != null) {
                    ResShippingIncome income = getShippingIncome(shipping);
                    income.setPaidPrice(transactionsEntity.getPrice());
                    income.setPaidRate(transactionsEntity.getRate());
                    income.setPaidPercent(BigDecimal.ZERO); // todo *
                    income.setPaidTotalPercent(BigDecimal.ZERO);  // todo *

                    income.setPaidAgreementPrice(trInvoice.getPrice());
                    income.setPaidAgreementCurrencyName(transactionsEntity.getCurrencyName());
                    income.setPaidAgreementRate(trInvoice.getRate());
                    income.setPaidAgreementFinalPrice(trInvoice.getFinalPrice());
                    income.setPaidAgreementTotalPrice(BigDecimal.ZERO); // todo *
                    income.setIncomeTotal(BigDecimal.ZERO); // todo *

                    res.add(income);
                }
            }

            if (shipping.getCargoEntities() != null && shipping.getCargoEntities().size() > 0) {
                shipping.getCargoEntities().forEach(cargoEntity -> {
                    List<UUID> cargoInvoiceIdList = invoiceRepository.findAllByCargo(cargoEntity).stream().map(AbsEntity::getId).collect(Collectors.toList());
                    List<TransactionsInvoicesEntity> cargoTransactionList = trInvRepository.findAllByInvoiceIdInAndKassaTypeIn(cargoInvoiceIdList, List.of(101));
                    for (TransactionsInvoicesEntity trInvoice : cargoTransactionList) {
                        TransactionsEntity transactionsEntity = transactionRepository.findById(trInvoice.getTransactionId()).orElse(null);
                        if (transactionsEntity != null) {
                            ResShippingIncome expence = getCargoExpence(cargoEntity);
                            expence.setPaidPrice(transactionsEntity.getPrice());
                            expence.setPaidRate(transactionsEntity.getRate());
                            expence.setPaidPercent(BigDecimal.ZERO); // todo *
                            expence.setPaidTotalPercent(BigDecimal.ZERO);  // todo *

                            expence.setPaidAgreementPrice(trInvoice.getPrice());
                            expence.setPaidAgreementCurrencyName(transactionsEntity.getCurrencyName());
                            expence.setPaidAgreementRate(trInvoice.getRate());
                            expence.setPaidAgreementFinalPrice(trInvoice.getFinalPrice());
                            expence.setPaidAgreementTotalPrice(BigDecimal.ZERO); // todo *
                            expence.setIncomeTotal(BigDecimal.ZERO); // todo *

                            res.add(expence);
                        }
                    }
                });
            }

            if (res.size() > 0)
                resList.add(res);
        });

        return resList;
    }

    private ResShippingIncome getShippingIncome(ShippingEntity shipping) {
        ResShippingIncome income = new ResShippingIncome();
        income.setId(shipping.getId());
        income.setShippingNum(shipping.getNum());
        income.setTransportNum(shipping.getShippingNum());
        income.setCargoNum("");
        carrierRepository.getCarrierById(shipping.getCarrierId()).ifPresent(carrier -> income.setOwnerName(carrier.getName()));
        income.setAgreementPrice(shipping.getPrice());
        income.setAgreementCurrencyName(shipping.getCurrencyName());
        income.setAgreementRate(shipping.getRate());
        income.setAgreementFinalPrice(shipping.getFinalPrice());
        income.setAgreementTotal(shipping.getFinalPrice()); // todo *
        income.setApprIncome(BigDecimal.ZERO); // todo *

        return income;
    }

    private ResShippingIncome getCargoExpence(CargoEntity cargo) {
        ResShippingIncome expence = new ResShippingIncome();
        expence.setId(cargo.getId());
        expence.setShippingNum(cargo.getShipping() != null ? cargo.getShipping().getNum() : null);
        expence.setTransportNum(cargo.getShipping() != null ? cargo.getShipping().getShippingNum() : "");
        expence.setCargoNum(cargo.getNum());
        clientRepository.getClientById(cargo.getOrder().getClientId()).ifPresent(clientEntity -> expence.setOwnerName(clientEntity.getName()));
        expence.setAgreementPrice(cargo.getPrice());
        expence.setAgreementCurrencyName(cargo.getCurrencyName());
        expence.setAgreementRate(cargo.getRate());
        expence.setAgreementFinalPrice(cargo.getFinalPrice());
        expence.setAgreementTotal(cargo.getFinalPrice()); // todo *
        expence.setApprIncome(BigDecimal.ZERO); // todo *

        return expence;
    }

}
