package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.Product;
import java.util.UUID;

public record ProductDto(UUID productID, String name, String description, byte[] image, double price, int quantity, Product.Category category) {
    public static ProductDto valueFrom(Product product) {
        return new ProductDto(product.getId(), product.getName(), product.getDescription(), product.getImage(), product.getPrice(), product.getQuantity(), product.getCategory());
    }
}
