package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.Product;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;
import java.util.UUID;
import java.util.Base64;

public record ProductCreationDto(UUID productID, @NotEmpty String name, @NotEmpty String description,
                                 @NotEmpty String image, @Positive double price, @PositiveOrZero int quantity,
                                 @NotNull Product.Category category) {
    public Product convertToModel() {
        Product product = new Product(productID != null ? productID : UUID.randomUUID());
        product.setName(this.name());
        product.setDescription(this.description());
        product.setImage(Base64.getDecoder().decode(this.image()));
        product.setPrice(this.price());
        product.setQuantity(this.quantity());
        product.setCategory(this.category());
        return product;
    }
}
