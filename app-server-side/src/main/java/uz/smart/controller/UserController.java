package uz.smart.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.smart.dto.UserDto;
import uz.smart.entity.Role;
import uz.smart.entity.User;
import uz.smart.exception.UserNotFoundException;
import uz.smart.payload.ApiResponse;
import uz.smart.payload.ResUser;
import uz.smart.projection.CustomUser;
import uz.smart.repository.RoleRepository;
import uz.smart.repository.UserRepository;
import uz.smart.security.CurrentUser;
import uz.smart.service.UserService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService service;

    @Autowired
    UserRepository repository;

    @Autowired
    RoleRepository roleRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@CurrentUser User user) {
        ArrayList<Role> roles = new ArrayList<>(user.getRoles());
        return ResponseEntity.ok(
                new ResUser(user.getId(), user.getFullName(), user.getLogin(),
                            user.getPhone(), roles.get(0).getId(), roles.get(0).getDescription()));
    }

    @GetMapping("/role")
    public List<Role> getUserRoles() {
        return roleRepository.findAll();
    }

//    @PreAuthorize(value = "hasAnyRole('ROLE_DIRECTOR','ROLE_MAIN_KASSIR', 'ROLE_KASSIR')")
    @PostMapping("/save")
    public HttpEntity<?> addNewUser(@RequestBody UserDto req) {
        return service.saveUser(req);
    }

//    @PreAuthorize(value = "hasAnyRole('ROLE_DIRECTOR','ROLE_MAIN_KASSIR', 'ROLE_KASSIR')")
    @GetMapping("/list")
    public List<CustomUser> getUsersList() {
        return repository.getAllUsers();
    }

//    @PreAuthorize(value = "hasAnyRole('ROLE_DIRECTOR','ROLE_MAIN_KASSIR', 'ROLE_KASSIR')")
    @GetMapping("/{id}")
    public CustomUser getById(@PathVariable UUID id) {
        return repository.getById(id).orElseThrow(() ->
                new UserNotFoundException("User with this id not found: " + id));
    }

    @DeleteMapping("/delete/{id}")
    public HttpEntity<?> deleteById(@PathVariable UUID id) {
        repository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("Пользователь успешно удален", true));
    }

    @GetMapping("/manager")
    public List<CustomUser> getManagers() {
        return repository.getAllByRolesIsIn(new ArrayList<>(Arrays.asList(roleRepository.getOne(20))));
    }
/*
    @PostMapping("/admin")
    public HttpEntity<?> editAdmin(@RequestBody ReqNewUser reqNewUser, @CurrentUser User header) {
        return userService.saveAdmin(reqNewUser, header);
    }

    @PreAuthorize(value = "hasAnyRole('ROLE_MAIN_KASSIR', 'ROLE_KASSIR')")
    @GetMapping("/cashiers")
    public List<CustomUser> getCashiersList(@CurrentUser User user) {
        return userRepository.getAllByIdIsNotAndRolesIsInAndHeaderIsNotNull(
                user.getId(),
                new ArrayList<>(Arrays.asList(roleRepository.getOne(30), roleRepository.getOne(40))));
    }

    @GetMapping("/status")
    public List<UserStatus> getUserStatus() {
        return userStatusRepository.findAll();
    }

    @GetMapping("/managers")
    public List<CustomUser> getManagers(@CurrentUser User current) {
        List<CustomUser> list = userRepository.getManagers(current);
        List<CustomUser> managers = new ArrayList<>();
        for (CustomUser user : list) {
            if (user.getRoles().size() == 1 && new ArrayList<>(user.getRoles()).get(0).getId() == 20){
                managers.add(user);
            }
        }
        return managers;
    }

    @GetMapping("/admin")
    public CustomUser getAminUser(@CurrentUser User user) {
        return user.getRoles().size() > 1 ? userRepository.getAdministrator() : null;
        *//*if (user.getRoles().size() > 1)
            return ResponseEntity.status(HttpStatus.OK).body(userRepository.getAdministrator());
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);*//*
    }
*/
}
