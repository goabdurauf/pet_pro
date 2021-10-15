package uz.smart.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uz.smart.entity.User;
import uz.smart.repository.RoleRepository;
import uz.smart.repository.UserRepository;

import java.util.Arrays;
import java.util.HashSet;

@Component
public class DataLoader implements CommandLineRunner {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Value("${spring.datasource.initialization-mode}")
    private String initializationMode;

    @Override
    public void run(String... args) throws Exception {
        if (initializationMode.equalsIgnoreCase("always")) {
            userRepository.save(new User(
                    "Super admin", "admin", null,
                    passwordEncoder.encode("Logistika"),
                    new HashSet<>(roleRepository.findAllById(Arrays.asList(10)))
            ));
        }
    }
}
