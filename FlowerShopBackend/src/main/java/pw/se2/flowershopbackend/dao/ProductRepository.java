package pw.se2.flowershopbackend.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import pw.se2.flowershopbackend.models.Product;

import java.util.Collection;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    Page<Product> findByNameLikeIgnoreCaseAndCategoryInAndPriceBetween(String name, Collection<Product.Category> category, double priceStart, double priceEnd, Pageable pageable);
}
