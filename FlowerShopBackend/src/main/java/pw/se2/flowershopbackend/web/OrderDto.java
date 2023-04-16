package pw.se2.flowershopbackend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import pw.se2.flowershopbackend.models.Order;

import java.io.IOException;
import java.util.UUID;

public record OrderDto(UUID orderID, AddressDto deliveryAddress, OrderProductDto[] items) {
    public static OrderDto valueFrom(Order order) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        AddressDto address = mapper.readValue(order.getAddress(), AddressDto.class);
        OrderProductDto[] items = (OrderProductDto[]) order.getOrderProducts().stream().map(OrderProductDto::valueFrom).toArray();
        return new OrderDto(order.getId(), address, items);
    }
}
