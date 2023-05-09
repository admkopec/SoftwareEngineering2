package pw.se2.flowershopbackend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pw.se2.flowershopbackend.models.BasketItem;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.User;
import java.util.List;
import java.util.Optional;

@Repository
public interface BasketItemRepository extends JpaRepository<BasketItem, Long> {
    Optional<List<BasketItem>> findByClient(User client);

    Optional<BasketItem> findByClientAndProduct(User client, Product product);
}
