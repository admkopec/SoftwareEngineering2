package pw.se2.flowershopbackend.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.OrderService;
import pw.se2.flowershopbackend.services.ProductService;
import pw.se2.flowershopbackend.web.OrderDto;
import pw.se2.flowershopbackend.web.OrderStatusChangeDto;
import java.util.Collection;
import java.util.UUID;
import pw.se2.flowershopbackend.web.OrderCreationDto;

@Tag(name = "Orders")
@RestController
@SecurityRequirement(name = "Bearer Authentication")
@RequestMapping(path = "/api/orders")
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    private final ProductService productService;

    public OrderController(OrderService orderService, ProductService productService)  {
        this.orderService = orderService;
        this.productService = productService;
    }

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Fetch Orders", description = "Orders will be returned in descending order by date created.")
    public ResponseEntity<Collection<OrderDto>> fetchOrders(
            @Parameter(name = "Order type", description = "A comma separated string containing valid order statuses: " +
                    "pending, accepted, declined, delivered. If not specified, fetch all orders according to user type.")
            @RequestParam(required = false) String statuses,
            @Parameter(name = "Page number", description = "The number of the page to be displayed")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(name = "Maximum number of elements on page", description = "The number of elements per page that will not be exceeded")
            @RequestParam(defaultValue = "30") int maxPerPage) {
        User user = User.getAuthenticated();
        Pageable paging = PageRequest.of(page, maxPerPage, Sort.by("dateCreated").descending());
        Collection<Order> orders = orderService.getOrdersFor(user, paging, statuses).getContent();
        return ResponseEntity.status(HttpStatus.OK).body(orders.stream().map(OrderDto::valueFrom).toList());
    }

    @GetMapping(path = "/{orderId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Fetch a specific Order")
    public ResponseEntity<OrderDto> fetchOrder(@PathVariable UUID orderId) {
        User user = User.getAuthenticated();
        Order order = orderService.getOrderByIdAuth(orderId, user);
        return ResponseEntity.status(HttpStatus.OK).body(OrderDto.valueFrom(order));
    }

    @PostMapping(path = "/{orderId}/change_status", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Change status of an Order", description = "Requires employee or delivery man authorisation")
    public void changeOrderStatus(@PathVariable UUID orderId, @RequestBody OrderStatusChangeDto statusChangeDto) {
        User user = User.getAuthenticated();
        orderService.changeStatus(orderId, statusChangeDto.orderStatus(), user);
    }

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create new Order")
    public void createOrder(@RequestBody OrderCreationDto orderDto) {
        User user = User.getAuthenticated();
        if (user.getRole() != User.Roles.Client) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
        }
        Order order = orderDto.convertToModel(productService);
        order.setClient(user);
        order.getOrderProducts().forEach((orderProduct) -> orderProduct.setOrder(order));
        orderService.validateAndSave(order);
    }

    @DeleteMapping(path = "/{orderId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete Order")
    public void deleteOrder(@PathVariable UUID orderId) {
        User user = User.getAuthenticated();
        orderService.deleteOrderByAuth(orderId, user);
    }

    @PutMapping(path = "/{orderId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Modify Order")
    public void modifyOrder(@PathVariable UUID orderId, @RequestBody OrderCreationDto orderDto) {
        User user = User.getAuthenticated();

        Order order = orderService.modifiedOrderBy(orderId, orderDto.convertToModel(productService));
        if (user != order.getClient()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
        }
        orderService.validateAndSave(order);
    }
}
