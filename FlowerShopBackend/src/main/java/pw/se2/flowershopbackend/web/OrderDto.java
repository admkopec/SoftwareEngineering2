package pw.se2.flowershopbackend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.models.Order;
import java.io.IOException;
import java.util.UUID;

public record OrderDto(UUID orderId, AddressDto deliveryAddress, OrderProductDto[] items) {
    public static OrderDto valueFrom(Order order) {
        AddressDto address;
        try {
            ObjectMapper mapper = new ObjectMapper();
            address = mapper.readValue(order.getAddress(), AddressDto.class);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Corrupted data in database.");
        }
        OrderProductDto[] items = (OrderProductDto[]) order.getOrderProducts().stream().map(OrderProductDto::valueFrom).toArray();
        return new OrderDto(order.getId(), address, items);
    }
}
