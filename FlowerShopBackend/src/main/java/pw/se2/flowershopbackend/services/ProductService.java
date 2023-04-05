package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.ProductRepository;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.User;

import java.util.UUID;

public class ProductService {
    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    public Product validateAndSave(Product product) {
        if (isValidProduct(product)) {
            log.info("Product is valid");
            product = productRepository.save(product);
            log.info("Product was saved.");
        }
        return product;
    }

    private boolean isValidProduct(Product product) {
        if (product != null) {
            if (product.getId() == null) {
                log.error("Null product id.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Null product id.");
            }
            if (isInvalid(product.getName())) {
                log.error("Empty product name.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty product name.");
            }
            if (isInvalid(product.getDescription())) {
                log.error("Empty product description.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty product description.");
            }
            return true;
        }
        log.error("Product is null.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is null.");
    }

    public void deleteProduct(UUID productId) {
        if (productRepository.existsById(productId)) {
            productRepository.deleteById(productId);
        }
    }

    public void assertEmployee(User user) {
        if (user.getRole() != User.Roles.Employee) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not authorized to add product");
        }
    }

    // MARK: - Helpers
    private boolean isInvalid(String value) {
        return value == null || value.isBlank();
    }
}
