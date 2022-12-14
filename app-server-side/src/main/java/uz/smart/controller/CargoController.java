package uz.smart.controller;

/*
    Created by Ilhom Ahmadjonov on 06.11.2021. 
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.CargoDto;
import uz.smart.dto.CargoStatusDto;
import uz.smart.dto.DocumentDto;
import uz.smart.dto.ExpenseDto;
import uz.smart.payload.*;
import uz.smart.service.CargoService;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cargo")
public class CargoController {

    @Autowired
    CargoService service;

    @PostMapping("/save")
    public HttpEntity<?> save(@RequestBody CargoDto dto) { return service.saveAndUpdate(dto); }

    @PostMapping("/clone")
    public HttpEntity<?> clone(@RequestBody CargoDto dto) { return service.cloneCargo(dto); }

    @PostMapping("/status")
    public HttpEntity<?> setStatus(@RequestBody CargoStatusDto dto) { return service.setStatus(dto); }

    @PostMapping("/document")
    public List<ResDocument> addDocument(@RequestBody DocumentDto dto){ return service.addDocument(dto);}

    @DeleteMapping("/{id}")
    public HttpEntity<?> delete(@PathVariable UUID id) { return service.deleteCargo(id); }

    @GetMapping("/{id}")
    public CargoDto get(@PathVariable UUID id) { return service.getCargo(id); }

    @PostMapping("/list")
    public HttpEntity<?> getList(@RequestBody ReqCargoSearch req) { return service.getCargoList(req); }

    @GetMapping("/order/{id}")
    public List<ResCargo> getListByOrder(@PathVariable UUID id) { return service.getCargoListByOrderId(id); }

    @GetMapping("/select/order/{id}")
    public List<ResCargo> getSelectListByOrder(@PathVariable UUID id) { return service.getCargoListForSelectByOrderId(id); }

    @GetMapping("/document/{orderId}")
    public List<ResDocument> getDocumentListByOrder(@PathVariable UUID orderId) { return service.getCargoDocumentsByOrderId(orderId); }

    @GetMapping("/doc/{docId}")
    public DocumentDto getCargoDocument(@PathVariable UUID docId) { return service.getCargoDocument(docId); }

    @DeleteMapping("/{id}/document/{docId}")
    public List<ResDocument> deleteDocumentFromCargo(@PathVariable UUID id, @PathVariable UUID docId){
        return service.removeDocumentFromCargo(id, docId);
    }

    @PostMapping("/expense")
    public ResCargoExpenses addExpense(@RequestBody ExpenseDto dto){ return service.addExpense(dto);}

    @GetMapping("/expense/{orderId}")
    public ResCargoExpenses getExpenseList(@PathVariable UUID orderId) {return service.getExpensesByOrderId(orderId);}

    @DeleteMapping("/expense/{id}")
    public HttpEntity<?> deleteExpense(@PathVariable UUID id) {return service.deleteExpenseFromCargo(id);}

    @PostMapping("/expense/divide")
    public HttpEntity<?> divideExpense(@RequestBody ResShippingDivide divide){ return service.divideExpense(divide);}

    @GetMapping("/{id}/invoice")
    public ResInvoice getForInvoice(@PathVariable UUID id) { return service.getForInvoice(id); }

    @PostMapping("/report")
    public void getExcelFile(HttpServletResponse response, @RequestBody ReqCargoSearch req) {
        service.getExcelFile(response, req);
    }
}
