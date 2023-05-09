package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.BasketItem;
import pw.se2.flowershopbackend.models.Product;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public record BasketDto(@NotNull Product product, @Positive int quantity) {
    public static BasketDto valueFrom(BasketItem basket) {
        return new BasketDto(basket.getProduct(), basket.getQuantity());
    }
}
