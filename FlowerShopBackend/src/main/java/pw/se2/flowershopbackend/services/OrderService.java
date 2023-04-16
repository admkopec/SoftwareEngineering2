package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.OrderRepository;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.User;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Collection<Order> getOrdersFor(User user) {
        if (user.getRole() == User.Roles.Client) {
            return user.getOrders();
        } else if (user.getRole() == User.Roles.DeliveryMan) {
            return user.getOrdersToDeliver();
        } else {
            log.error("User not authorized to perform this action.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
        }
    }

    public Order getOrder(UUID orderID, User user) {
        Optional<Order> optionalOrder = orderRepository.findById(orderID);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            // Verify the user is authorized to fetch this order
            if (order.getClient().getId() == user.getId() || (order.getDeliveryMan() != null && order.getDeliveryMan().getId() == user.getId()) || user.getRole() == User.Roles.Employee) {
                return order;
            } else {
                log.error("User not authorized to perform this action.");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such order");
        }
    }
}
