package uz.smart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.smart.entity.Role;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Integer> {
//    Optional<Set<Role>> findAllById(Integer id);
//
//    @Query(value = "select * from role where id > 9 order by id", nativeQuery = true)
//    List<Role> getRoles();
}
