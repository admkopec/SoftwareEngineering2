package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.Product;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.UUID;

public record ProductCreationDto(UUID productID, @NotEmpty String name, @NotEmpty String description, @NotNull byte[] image, @NotNull double price) {
    public Product convertToModel() {
        Product product = new Product(productID != null ? productID : UUID.randomUUID());
        product.setName(this.name());
        product.setDescription(this.description());
        product.setImage(this.image());
        product.setPrice(this.price());
        return product;
    }
}
