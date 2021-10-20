package uz.smart.component;

import org.springframework.stereotype.Component;
import uz.smart.entity.Role;
import uz.smart.entity.User;

import java.util.ArrayList;
import java.util.stream.Collectors;

@Component("valueHelper")
public class ValueHelper {

    public int getUserRoleId(User user) {
        if (user.getRoles().size() > 0)
            return new ArrayList<>(user.getRoles()).get(0).getId();

        return 0;
    }

    public String getUserRoleName(User user) {
        if (user.getRoles().size() > 0)
            return new ArrayList<>(user.getRoles()).get(0).getDescription();

        return "";
    }

}
