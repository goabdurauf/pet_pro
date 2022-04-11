package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.smart.dto.BalancesCurrencyDto;
import uz.smart.dto.BalancesDto;
import uz.smart.dto.BalancesTotalDto;
import uz.smart.entity.BalancesEntity;
import uz.smart.entity.CarrierEntity;
import uz.smart.entity.ClientEntity;
import uz.smart.entity.ListEntity;
import uz.smart.entity.enums.BalanceType;
import uz.smart.repository.BalancesRepository;
import uz.smart.repository.CarrierRepository;
import uz.smart.repository.ClientRepository;
import uz.smart.repository.ListRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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

    public BalancesTotalDto getClientBalances() {
        BalancesTotalDto dto = new BalancesTotalDto();
        List<ClientEntity> clients = clientRepository.getAllClients();
        for (ClientEntity client : clients) {
            dto.getAgents().addAll(getBalanceDto(client.getName(), repository.getAllByOwnerId(client.getId())));
            /*List<BalancesEntity> balanceList = repository.getAllByOwnerId(client.getId());
            for (BalancesEntity entity : balanceList) {
                if (entity.getType() == null) {
                    entity.setType(BalanceType.Client);
                    repository.saveAndFlush(entity);
                }
                dto.getAgents().add(new BalancesDto(client.getName(), entity.getCurrencyName(), entity.getBalance()));
            }*/
        }

        List<ListEntity> currencyList = listRepository.getListByType(4);
        currencyList.forEach(currency -> {
            BigDecimal balance = repository.getBalanceByCurrencyAndType(currency.getId(), BalanceType.Client);
            dto.getCurrencies().add(new BalancesCurrencyDto(currency.getNameRu(), balance != null ? balance : BigDecimal.ZERO));
        });

        return dto;
    }

    public BalancesTotalDto getCarrierBalances() {
        BalancesTotalDto dto = new BalancesTotalDto();
        List<CarrierEntity> carriers = carrierRepository.getAllCarriers();
        for (CarrierEntity carrier : carriers) {
            dto.getAgents().addAll(getBalanceDto(carrier.getName(), repository.getAllByOwnerId(carrier.getId())));
            /*List<BalancesEntity> balanceList = repository.getAllByOwnerId(carrier.getId());
            for (BalancesEntity entity : balanceList) {
                if (entity.getType() == null) {
                    entity.setType(BalanceType.Carrier);
                    repository.saveAndFlush(entity);
                }
                dto.getAgents().add(new BalancesDto(carrier.getName(), entity.getCurrencyName(), entity.getBalance()));
            }*/
        }

        List<ListEntity> currencyList = listRepository.getListByType(4);
        currencyList.forEach(currency -> {
            BigDecimal balance = repository.getBalanceByCurrencyAndType(currency.getId(), BalanceType.Carrier);
            dto.getCurrencies().add(new BalancesCurrencyDto(currency.getNameRu(), balance != null ? balance : BigDecimal.ZERO));
        });

        return dto;
    }

    private List<BalancesDto> getBalanceDto(String ownerName, List<BalancesEntity> entityList) {
        List<BalancesDto> dtoList = new ArrayList<>();
        entityList.forEach(entity -> dtoList.add(new BalancesDto(ownerName, entity.getCurrencyName(), entity.getBalance())));
        return dtoList;
    }
}
