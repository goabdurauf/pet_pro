package uz.smart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.ListEntity;

import java.util.List;
import java.util.Optional;

public interface ListRepository extends JpaRepository<ListEntity, Long> {

    @Transactional
    @Modifying
    @Query("update list set state=0 where id = :id")
    void updateById(long id);

    @Query("select l from list l where l.state > 0 and l.id = :id")
    Optional<ListEntity> getListItemWithId(Long id);

    @Query("select t from list t where t.typeId = :type and t.state > 0 order by t.id")
    List<ListEntity> getListByType(long type);
}
