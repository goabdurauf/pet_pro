package uz.smart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.smart.entity.ProductEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {

    @Transactional
    @Modifying
    @Query("update product set state=0 where id = :id")
    void updateById(UUID id);

    @Query("select p from product p where p.state > 0 and p.id = :id")
    Optional<ProductEntity> getProductById(UUID id);

    @Query("select p from product p where p.state>0 order by p.createdAt")
    List<ProductEntity> getProductList();

    @Query("select p from product p where p.state>0 and (lower(p.name) like concat('%', :word, '%') or lower(p.code) like concat('%', :word, '%')) order by p.createdAt")
    List<ProductEntity> searchProducts(String word);

}
