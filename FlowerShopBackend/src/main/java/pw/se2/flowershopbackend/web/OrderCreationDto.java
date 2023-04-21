package pw.se2.flowershopbackend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.OrderProduct;
import pw.se2.flowershopbackend.services.OrderService;
import pw.se2.flowershopbackend.services.ProductService;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.*;

public record OrderCreationDto(UUID orderId, @NotNull AddressDto deliveryAddress,
                               @NotEmpty OrderProductDto[] items) {
    public Order convertToModel(ProductService productService) {
        Order order = new Order(orderId != null ? orderId : UUID.randomUUID());
        String address;
        try {
            ObjectMapper mapper = new ObjectMapper();
            address = mapper.writeValueAsString(deliveryAddress);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Corrupted data in request");
        }
        order.setAddress(address);
        List<OrderProduct> orderProducts = Arrays.stream(items).map((orderProductDto) ->
                orderProductDto.convertToModel(productService)).toList();
        Set<OrderProduct> orderProductSet = new LinkedHashSet<>(orderProducts);
        order.setOrderProducts(orderProductSet);
        return order;
    }
}
