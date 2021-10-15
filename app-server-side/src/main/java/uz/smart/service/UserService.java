package uz.smart.service;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import uz.smart.entity.User;
import uz.smart.exception.ResourceNotFoundException;
import uz.smart.payload.ApiResponse;
import uz.smart.dto.UserDto;
import uz.smart.repository.RoleRepository;
import uz.smart.repository.UserRepository;

import java.util.Arrays;
import java.util.HashSet;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public HttpEntity<?> saveUser(UserDto req){
        User user = new User();
        if (req.getId() != null){
            user = repository.findById(req.getId()).orElseThrow(
                    () -> new ResourceNotFoundException("User", "Id", req.getId()));
        }else if(repository.existsByLogin(req.getLogin())){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse("Такой логин уже есть в системе!", false));
        }

        user.setFullName(req.getFullName());
        user.setLogin(req.getLogin());
        user.setPhone(req.getPhone());
        if (req.getId() == null || StringUtils.hasText(req.getPassword())){
            user.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        user.setRoles(new HashSet<>(Arrays.asList(roleRepository.findById(20)    // req.getRole()
                .orElseThrow(() -> new ResourceNotFoundException("User", "role", req.getRole())))));

        repository.saveAndFlush(user);

        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse("Пользователь успешно сохранен", true));
    }
}
