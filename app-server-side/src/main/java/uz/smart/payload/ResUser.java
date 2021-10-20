package uz.smart.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import uz.smart.entity.Role;

import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
public class ResUser {
    private UUID id;
    private String fullName;
    private String login;
    private String phone;
    private int roleId;
    private String roleName;
}
