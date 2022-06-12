package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 20.10.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.ClientDto;
import uz.smart.service.ClientService;

import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/client")
public class ClientController {

  @Autowired
  ClientService service;

  @PostMapping("/save")
  public HttpEntity<?> save(@RequestBody ClientDto dto) {
    return service.saveAndUpdateClient(dto);
  }

  @DeleteMapping("/{id}")
  public HttpEntity<?> delete(@PathVariable UUID id) {
    return service.deleteClient(id);
  }

  @GetMapping("/{id}")
  public ClientDto get(@PathVariable UUID id) {
    return service.getClient(id);
  }

  @GetMapping("/list")
  public List<ClientDto> getList() {
    return service.getClientList();
  }

  @GetMapping("/dashboard")
  public HttpEntity<?> getFotDashboard(@RequestParam(required = false) Long days) {
    return ResponseEntity.ok(service.getClientReport(days));
  }

  @GetMapping("/client-growth-report")
  public HttpEntity<?> getClientCountByCreatedAt(@RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy") Date begin,
                                                 @RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy") Date end) {
    return ResponseEntity.ok(service.getClientCountByCreatedAt(begin, end));
  }

  @GetMapping("/report")
  public void getExcelFile(HttpServletResponse response) {
    service.getExcelFile(response);
  }
}
