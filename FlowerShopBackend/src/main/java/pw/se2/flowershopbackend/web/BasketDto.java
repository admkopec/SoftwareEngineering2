package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.BasketItem;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public record BasketDto(@NotNull ProductDto product, @Positive int quantity) {
    public static BasketDto valueFrom(BasketItem basket) {
        return new BasketDto(ProductDto.valueFrom(basket.getProduct()), basket.getQuantity());
    }
}
