package uz.smart.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class UserDto {
    private UUID id;
    private String fullName;
    private String login;
    private String phone;
    private String password;
    private Integer role;
}
