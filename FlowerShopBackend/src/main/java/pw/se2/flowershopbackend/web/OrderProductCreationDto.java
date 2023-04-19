package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.OrderProduct;
import pw.se2.flowershopbackend.services.ProductService;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.UUID;

public record OrderProductCreationDto(@NotNull UUID productId, @Positive long quantity) {
    public OrderProduct convertToModel(ProductService productService) {
        OrderProduct orderProduct = new OrderProduct();
        orderProduct.setProduct(productService.getProductById(productId));
        orderProduct.setQuantity(this.quantity);
        return orderProduct;
    }
}
