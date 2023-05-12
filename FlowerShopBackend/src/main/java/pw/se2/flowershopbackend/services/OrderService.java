package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.OrderRepository;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.User;

import java.util.Optional;
import java.util.UUID;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final OrderRepository orderRepository;
    private final UserService userService;
    private final AlgorithmService algorithmService;
    private final OrderProductService orderProductService;

    public OrderService(OrderRepository orderRepository, UserService userService, AlgorithmService algorithmService, OrderProductService orderProductService) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.algorithmService = algorithmService;
        this.orderProductService = orderProductService;
    }

    public Page<Order> getOrdersFor(User user, Pageable paging) {
        if (user.getRole() == User.Roles.Client) {
            return orderRepository.findByClient(user, paging);
        } else if (user.getRole() == User.Roles.DeliveryMan) {
            return orderRepository.findByDeliveryMan(user, paging);
        } else {
            log.error("User not authorized to perform this action.");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
        }
    }

    public Order getOrderByIdAuth(UUID orderID, User user) {
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
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such order.");
        }
    }

    public Order modifiedOrderBy(UUID orderID, Order newOrder) {
        Optional<Order> optionalOrder = orderRepository.findById(orderID);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            if (order.getStatus() == Order.Status.Accepted || order.getStatus() == Order.Status.Delivered) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This order cannot be modified.");
            }
            order.setAddress(newOrder.getAddress());
            order.setStatus(null);
            orderProductService.deleteAll(order.getOrderProducts());
            order.setOrderProducts(newOrder.getOrderProducts());
            return order;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such order.");
        }
    }

    public void deleteOrderByAuth(UUID orderID, User user) {
        Optional<Order> optionalOrder = orderRepository.findById(orderID);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            // Verify the user is authorized to cancel this order
            if (order.getClient().getId() == user.getId() || user.getRole() == User.Roles.Employee) {
                if (order.getStatus() == Order.Status.Accepted || order.getStatus() == Order.Status.Delivered) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This order cannot be cancelled.");
                }
                orderProductService.deleteAll(order.getOrderProducts());
                orderRepository.delete(order);
            } else {
                log.error("User not authorized to perform this action.");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
            }
        }
    }

    public boolean isOrderValid(Order order) {
        if (order != null) {
            if (order.getId() == null) {
                log.error("Null order id.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Null product id.");
            }
            if (order.getAddress().isBlank()) {
                log.error("Empty address.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty address.");
            }
            return true;
        }
        log.error("Order is null.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is null.");
    }

    public void validateAndSave(Order order) {
        if (isOrderValid(order) && order.getOrderProducts().stream().allMatch(orderProductService::isOrderProductValid)) {
            log.info("Order is valid");
            orderRepository.save(order);
            orderProductService.validateAndSaveAll(order.getOrderProducts());
            log.info("Order was saved.");
        }
    }

    public void changeStatus(UUID orderID, Order.Status status, User user) {
        Optional<Order> optionalOrder = orderRepository.findById(orderID);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            // Verify the user is authorized to fetch this order
            switch (status) {
                case Accepted, Declined -> {
                    if (user.getRole() != User.Roles.Employee) {
                        log.error("User not authorized to perform this action.");
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
                    }
                    if (order.getStatus() == Order.Status.Delivered) {
                        log.error("User cannot perform this action now.");
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User cannot perform this action now.");
                    }
                    // Inform client about the change
                    userService.notify(order.getClient(), status);
                    if (status == Order.Status.Accepted) {
                        // If status is accepted assign delivery man
                        algorithmService.assignDeliveryManFor(order);
                    }
                }
                case Delivered -> {
                    if (user.getRole() != User.Roles.DeliveryMan || order.getDeliveryMan() == null || !order.getDeliveryMan().getId().equals(user.getId())) {
                        log.error("User not authorized to perform this action.");
                        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
                    }
                    if (order.getStatus() != Order.Status.Accepted) {
                        log.error("User cannot perform this action now.");
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User cannot perform this action now.");
                    }
                    // Inform client about the successful delivery
                    userService.notify(order.getClient(), status);
                }
                // TODO: Archive order
                default -> {
                    log.error("User not authorized to perform this action.");
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
                }
            }
            order.setStatus(status);
            orderRepository.save(order);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such order");
        }
    }
}
