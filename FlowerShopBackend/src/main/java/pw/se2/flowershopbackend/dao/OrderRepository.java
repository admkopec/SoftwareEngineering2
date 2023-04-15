package pw.se2.flowershopbackend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.se2.flowershopbackend.models.Order;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}
