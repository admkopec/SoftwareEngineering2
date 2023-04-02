package pw.se2.flowershopbackend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.se2.flowershopbackend.models.Product;

import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
}
