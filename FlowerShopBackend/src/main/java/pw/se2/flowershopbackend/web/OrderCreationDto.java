package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.OrderProduct;
import pw.se2.flowershopbackend.services.OrderService;
import pw.se2.flowershopbackend.services.ProductService;
import javax.validation.constraints.NotEmpty;
import java.util.*;

public record OrderCreationDto(UUID orderId, @NotEmpty String address,
                               @NotEmpty OrderProductCreationDto[] items) {
    public Order convertToModel(ProductService productService) {
        Order order = new Order(orderId != null ? orderId : UUID.randomUUID());
        order.setAddress(address);
        List<OrderProduct> orderProducts = Arrays.stream(items).map((orderProductCreationDto) ->
                orderProductCreationDto.convertToModel(productService)).toList();
        Set<OrderProduct> orderProductSet = new LinkedHashSet<>(orderProducts);
        order.setOrderProducts(orderProductSet);
        return order;
    }
}
