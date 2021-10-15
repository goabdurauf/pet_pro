package uz.smart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uz.smart.entity.Role;
import uz.smart.entity.User;
import uz.smart.projection.CustomUser;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByLogin(String phone);

    Boolean existsByLogin(String mobile);

    @Query(value = "select t from users t where t.enabled=true order by t.createdAt")
    List<CustomUser> getAllUsers();

    Optional<CustomUser> getById(UUID id);
}
