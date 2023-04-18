package pw.se2.flowershopbackend.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.OrderService;
import pw.se2.flowershopbackend.web.OrderDto;
import pw.se2.flowershopbackend.web.OrderStatusChangeDto;
import pw.se2.flowershopbackend.web.ProductCreationDto;

import java.util.Collection;
import java.util.UUID;

@Tag(name = "Orders")
@RestController
@RequestMapping(path = "/api/orders")
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    public OrderController(OrderService orderService)  {
        this.orderService = orderService;
    }

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Collection<OrderDto>> fetchOrders() {
        User user = User.getAuthenticated();
        Collection<Order> orders = orderService.getOrdersFor(user);
        return ResponseEntity.status(HttpStatus.OK).body(orders.stream().map(OrderDto::valueFrom).toList());
    }

    @GetMapping(path = "/{orderId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrderDto> fetchOrder(@PathVariable UUID orderId) {
        User user = User.getAuthenticated();
        Order order = orderService.getOrder(orderId, user);
        return ResponseEntity.status(HttpStatus.OK).body(OrderDto.valueFrom(order));
    }

    @PostMapping(path = "/{orderId}/change_status", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public void changeOrderStatus(@PathVariable UUID orderId, @RequestBody OrderStatusChangeDto statusChangeDto) {
        User user = User.getAuthenticated();
        orderService.changeStatus(orderId, statusChangeDto.orderStatus(), user);
    }
}
