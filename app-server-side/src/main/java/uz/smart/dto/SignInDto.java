package uz.smart.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class SignInDto {
    @NotBlank
    private String login;
    @NotBlank
    private String password;
}
