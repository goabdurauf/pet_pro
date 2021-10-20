package uz.smart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.ListDto;
import uz.smart.service.ListService;

import java.util.List;

@RestController
@RequestMapping("/api/list")
public class ListController {

    @Autowired
    ListService service;

    @PostMapping("/save")
    public HttpEntity<?> saveAndUpdate(@RequestBody ListDto dto) {
        return service.saveAndUpdateListItem(dto);
    }

    @DeleteMapping("/delete/{id}")
    public HttpEntity<?> deleteListItem(@PathVariable long id) {
        return service.deleteItem(id);
    }

    @GetMapping("/{type}")
    public List<ListDto> getListItems(@PathVariable long type) {
        return service.getItems(type);
    }

    @GetMapping("/item/{id}")
    public ListDto getListItem(@PathVariable long id) {
        return service.getItem(id);
    }
}
