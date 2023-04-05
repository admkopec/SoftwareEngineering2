package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.Product;
import java.util.UUID;

// TODO: Implement

public record ProductDto(UUID productID, String name, String description, byte[] image, double price) {
    public static ProductDto valueFrom(Product product) {
        return new ProductDto(product.getId(), product.getName(), product.getDescription(), product.getImage(), product.getPrice());
    }
}
