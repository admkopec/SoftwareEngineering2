package pw.se2.flowershopbackend.services;

import org.springframework.stereotype.Service;
import pw.se2.flowershopbackend.dao.OrderRepository;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.User;

import java.util.Collections;
import java.util.List;

@Service
public class AlgorithmService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    public AlgorithmService(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }


    public void assignDeliveryManFor(Order order) {
        List<User> deliveryMen  = userRepository.findByRole(User.Roles.DeliveryMan);
        User deliveryManWithMinOrders = Collections.min(deliveryMen, new OrdersCountsComparator());
        order.setDeliveryMan(deliveryManWithMinOrders);
        orderRepository.save(order);
    }
}
