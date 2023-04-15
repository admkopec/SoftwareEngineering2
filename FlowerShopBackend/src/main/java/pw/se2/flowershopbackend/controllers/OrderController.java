package pw.se2.flowershopbackend.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pw.se2.flowershopbackend.services.OrderService;

@Tag(name = "Orders")
@RestController
@RequestMapping(path = "/api/orders")
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    public OrderController(OrderService orderService)  {
        this.orderService = orderService;
    }
}
