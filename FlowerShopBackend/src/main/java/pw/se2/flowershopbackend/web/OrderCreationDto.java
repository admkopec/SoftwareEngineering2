package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.Order;

import javax.validation.constraints.NotNull;
import java.util.UUID;

public record OrderCreationDto(UUID orderID, @NotNull UUID clientID, @NotNull AddressDto deliveryAddress, @NotNull OrderProductDto[] items) {
    public Order convertToModel() {
        // TODO: Implement
        return null;
    }
}
