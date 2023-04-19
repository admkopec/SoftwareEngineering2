package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.Order;
import javax.validation.constraints.NotBlank;

public record OrderStatusChangeDto(@NotBlank Order.Status orderStatus) { }
