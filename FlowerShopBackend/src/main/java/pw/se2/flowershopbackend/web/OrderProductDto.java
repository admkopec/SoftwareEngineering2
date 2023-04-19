package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.OrderProduct;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.UUID;

public record OrderProductDto(@NotNull UUID productId, @Positive long quantity) {

    public static OrderProductDto valueFrom(OrderProduct orderProduct) {
        return new OrderProductDto(orderProduct.getProduct().getId(), orderProduct.getQuantity());
    }
}
