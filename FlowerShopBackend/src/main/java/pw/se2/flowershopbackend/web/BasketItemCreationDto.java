package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.BasketItem;
import pw.se2.flowershopbackend.services.ProductService;

import javax.validation.constraints.Positive;
import java.util.UUID;

public record BasketItemCreationDto(UUID productId, @Positive int quantity) {
    public BasketItem convertToModel(ProductService productService) {
        BasketItem basketItem = new BasketItem();
        if (productId != null)
            basketItem.setProduct(productService.getProductById(productId));
        basketItem.setQuantity(quantity);
        return basketItem;
    }
}
