package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 01.03.2022. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.smart.dto.BalancesDto;
import uz.smart.entity.CarrierEntity;
import uz.smart.entity.ClientEntity;
import uz.smart.repository.BalancesRepository;
import uz.smart.repository.CarrierRepository;
import uz.smart.repository.ClientRepository;

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

    public List<BalancesDto> getClientBalances() {
        List<BalancesDto> list = new ArrayList<>();
        List<ClientEntity> clients = clientRepository.getAllClients();
        for (ClientEntity client : clients) {
            list.add(new BalancesDto(client.getId(), client.getName(), repository.getAllByOwnerId(client.getId())));
        }

        return list;
    }

    public List<BalancesDto> getCarrierBalances() {
        List<BalancesDto> list = new ArrayList<>();
        List<CarrierEntity> carriers = carrierRepository.getAllCarriers();
        for (CarrierEntity carrier : carriers) {
            list.add(new BalancesDto(carrier.getId(), carrier.getName(), repository.getAllByOwnerId(carrier.getId())));
        }

        return list;
    }
}
