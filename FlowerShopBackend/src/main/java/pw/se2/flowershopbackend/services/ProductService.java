package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.ProductRepository;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.Product_;
import pw.se2.flowershopbackend.models.User;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

import static org.springframework.data.jpa.domain.Specification.where;

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

    public Product getProductById(UUID id) {
        Optional<Product> product = productRepository.findById(id);

        if(product.isPresent())
        {
            return product.get();
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
            log.error("User is not an employee");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not authorized to update products");
        }
    }

    private Specification<Product> nameLike(String name){
        if (name == null)
            return (root, query, criteriaBuilder)
                    -> criteriaBuilder.conjunction();
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.like(root.get(Product_.NAME), "%"+name+"%");
    }
    public Page<Product> getFilteredProducts(String query,
                                             String categories,
                                             Integer minPrice,
                                             Integer maxPrice,
                                             Pageable page) {
        if (maxPrice < minPrice)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid min/max prices.");
        return productRepository.findAll(
                where(nameLike(query))
                        .and(belongsToCategory(categories))
                        .and(priceMatches(minPrice, maxPrice)),
                page);
    }

    private Specification<Product> priceMatches(Integer minPrice, Integer maxPrice){
        // TODO: implement checking maximum price of product in our database
        if (minPrice == null || maxPrice == null)
            return (root, query, criteriaBuilder)
                    -> criteriaBuilder.conjunction();
        return (root, query, criteriaBuilder)
                -> criteriaBuilder.between(root.get(Product_.PRICE), minPrice, maxPrice);
    }

    private Specification<Product> belongsToCategory(String categories){
        if (categories == null)
            return (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

        List<Product.Category> categoriesList = Arrays.stream(categories.split(",")).toList().stream()
                .map(Product.Category::valueOf).toList();

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.in(root.get(Product_.CATEGORY)).value(categoriesList);
    }

}
