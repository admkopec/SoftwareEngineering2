package pw.se2.flowershopbackend.web;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.UUID;

public record BasketDto(@NotNull UUID productID, @Positive int quantity) {
}
