package pw.se2.flowershopbackend.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.User;

import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {
    Page<Order> findByClient(User client, Pageable pageable);

    Page<Order> findByDeliveryMan(User deliveryMan, Pageable pageable);
}
