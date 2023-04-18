package pw.se2.flowershopbackend.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.OrderProduct;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.User;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.services.OrderProductService;
import pw.se2.flowershopbackend.services.OrderService;
import pw.se2.flowershopbackend.services.ProductService;
import pw.se2.flowershopbackend.services.UserService;
import pw.se2.flowershopbackend.web.OrderDto;
import pw.se2.flowershopbackend.web.OrderStatusChangeDto;
import pw.se2.flowershopbackend.web.ProductCreationDto;

import java.util.Collection;
import java.util.UUID;
import pw.se2.flowershopbackend.web.OrderCreationDto;

@Tag(name = "Orders")
@RestController
@RequestMapping(path = "/api/orders")
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    private final ProductService productService;

    private final UserService userService;

    private final OrderProductService orderProductService;

    public OrderController(OrderService orderService, OrderProductService orderProductService,
                           ProductService productService, UserService userService)  {
        this.orderService = orderService;
        this.orderProductService = orderProductService;
        this.productService = productService;
        this.userService = userService;
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
        Order order = orderService.getOrderByIdAuth(orderId, user);
        return ResponseEntity.status(HttpStatus.OK).body(OrderDto.valueFrom(order));
    }

    @PostMapping(path = "/{orderId}/change_status", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public void changeOrderStatus(@PathVariable UUID orderId, @RequestBody OrderStatusChangeDto statusChangeDto) {
        User user = User.getAuthenticated();
        orderService.changeStatus(orderId, statusChangeDto.orderStatus(), user);
    }

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public void createOrder(@RequestBody OrderCreationDto orderDto) {
        User user = User.getAuthenticated();
        Order order = orderDto.convertToModel(productService);
        order.setClient(userService.getUserById(user.getId()));
        order.getOrderProducts().forEach((orderProduct) -> orderProduct.setOrder(order));
        orderService.validateAndSave(order);
        orderProductService.validateAndSaveAll(order.getOrderProducts());
    }
}
