package uz.smart.service;

/*
    Created by Ilhom Ahmadjonov on 30.10.2021. 
*/

import lombok.AllArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.smart.dto.CarrierDto;
import uz.smart.entity.CarrierEntity;
import uz.smart.entity.ListEntity;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.mapper.MapperUtil;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.Report;
import uz.smart.repository.CarrierRepository;
import uz.smart.repository.ListRepository;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

@Service @AllArgsConstructor
public class CarrierService {

    private CarrierRepository repository;
    private final ListRepository listRepository;
    private final MapperUtil mapperUtil;
    private final ReportService reportService;

    public HttpEntity<?> saveAndUpdateCarrier(CarrierDto dto){
        CarrierEntity entity = dto.getId() == null
                ? mapperUtil.toCarrierEntity(dto)
                : mapperUtil.updateCarrierEntity(dto, repository.findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrier", "Id", dto.getId())));

        ListEntity country = listRepository.findById(dto.getCountryId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "countryId", dto.getCountryId()));
        entity.setCountryName(country.getNameRu());

        ListEntity about = listRepository.findById(dto.getAboutId())
                .orElseThrow(() -> new ResourceNotFoundException("List", "aboutId", dto.getAboutId()));
        entity.setAboutName(about.getNameRu());

        repository.save(entity);
        return ResponseEntity.ok().body(new ApiResponse("Сохранено успешно", true));
    }

    public HttpEntity<?> deleteCarrier(UUID id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    public CarrierDto getCarrier(UUID id) {
        return mapperUtil.toCarrierDto(repository.getCarrierById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrier", "id", id)));
    }

    public List<CarrierDto> getCarrierList() {return mapperUtil.toCarrierDto(repository.getAllCarriers());}

    public void getExcelFile(HttpServletResponse response) {
        List<CarrierDto> orderReports = getCarrierList();
        String[] sheetNames = {"Перевозчики"};
        String templateName = "CarrierReport.jrxml";
        String fileName = "CarrierReport";
        reportService.getExcelFile(response, new Report<>(templateName, sheetNames, fileName, orderReports));
    }
}
