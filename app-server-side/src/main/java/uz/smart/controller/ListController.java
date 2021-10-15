package uz.smart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.ListDto;
import uz.smart.payload.ApiResponse;
import uz.smart.repository.ListRepository;
import uz.smart.service.ListService;

import java.util.List;

@RestController
@RequestMapping("/api/list")
public class ListController {

    @Autowired
    ListService service;

    @Autowired
    ListRepository repository;

    @PostMapping("/save")
    public HttpEntity<?> addNewListItem(@RequestBody ListDto dto) {
        return service.saveList(dto);
    }

    @PutMapping("/update")
    public HttpEntity<?> updateListItem(@RequestBody ListDto dto) {
        return service.updateList(dto);
    }

    @DeleteMapping("/delete/{id}")
    public HttpEntity<?> deleteListItem(@PathVariable long id) {
        repository.updateById(id);
        return ResponseEntity.ok().body(new ApiResponse("Удалено успешно", true));
    }

    @GetMapping("/list/{type}")
    public List<ListDto> getListItems(@PathVariable long type) {
        return service.getItems(type);
    }

    @GetMapping("/list/{id}")
    public ListDto getListItem(@PathVariable long id) {
        return service.getItem(id);
    }
}
