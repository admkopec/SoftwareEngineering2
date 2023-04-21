package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.ProductRepository;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.User;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Service
public class ProductService {
    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    public void validateAndSave(Product product) {
        if (isProductValid(product)) {
            log.info("Product is valid");
            productRepository.save(product);
            log.info("Product was saved.");
        }
    }
    public void validateAndSaveMany(List<Product> products) {
        products.forEach((product) -> {
            if (isProductValid(product)) {
                log.info("Product is valid");
                productRepository.save(product);
                log.info("Product was saved.");
            }
        });
    }

//    public Product getProductById(UUID productId){
//        Optional<Product> product = productRepository.findById(productId);
//        if (product.isEmpty()) {
//            log.info("Product is not present in the database.");
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product is not present in the database.");
//        } else
//            return product.get();
//    }
    public Product getProductById(UUID id) {
        Product product;

        if(productRepository.existsById(id))
        {
            product = productRepository.getById(id);
            return product;
        }
        else
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such product");
        }
    }


    public List<Product> getAllProducts () {
        return productRepository.findAll();
    }

    public boolean isProductValid(Product product) {
        if (product != null) {
            if (product.getId() == null) {
                log.error("Null product id.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Null product id.");
            }
//            MARK: Can also check validity of string using built in functions
            if (product.getName().isBlank()) {
                log.error("Empty product name.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty product name.");
            }
            if (product.getDescription().isBlank()) {
                log.error("Empty product description.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty product description.");
            }
            if (product.getPrice() < 0) {
                log.error("Negative product price.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Negative product price.");
            }
            if (product.getQuantity() < 0) {
                log.error("Negative product quantity.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Negative product quantity.");
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
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not authorized to add products");
        }
    }
}
