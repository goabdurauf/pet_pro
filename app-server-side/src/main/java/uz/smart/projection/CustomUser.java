package uz.smart.projection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;
import uz.smart.entity.Role;
import uz.smart.entity.User;

import java.util.Set;
import java.util.UUID;

@Projection(name = "customUser", types = User.class)
public interface CustomUser {
    UUID getId();
    String getFullName();
    String getLogin();
    String getPhone();

    @Value("#{@valueHelper.getUserRoleId(target)}")
    int getRole();

    @Value("#{@valueHelper.getUserRoleName(target)}")
    String getRoleName();
}
