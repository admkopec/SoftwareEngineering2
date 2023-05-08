package pw.se2.flowershopbackend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pw.se2.flowershopbackend.models.Product;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
}
