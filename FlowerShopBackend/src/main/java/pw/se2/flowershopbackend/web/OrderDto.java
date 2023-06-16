package pw.se2.flowershopbackend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.models.Order;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public record OrderDto(UUID orderId, AddressDto deliveryAddress, Date dateCreated, List<OrderProductDto> items, Order.Status status) {
    public static OrderDto valueFrom(Order order) {
        AddressDto address;
        try {
            ObjectMapper mapper = new ObjectMapper();
            address = mapper.readValue(order.getAddress(), AddressDto.class);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Corrupted data in database.");
        }
        List<OrderProductDto> items = order.getOrderProducts().stream().map(OrderProductDto::valueFrom).toList();
        return new OrderDto(order.getId(), address, order.getDateCreated(), items, order.getStatus());
    }
}
