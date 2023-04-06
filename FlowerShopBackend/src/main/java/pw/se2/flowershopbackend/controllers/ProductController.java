package pw.se2.flowershopbackend.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.ProductService;
import pw.se2.flowershopbackend.web.ProductCreationDto;
import pw.se2.flowershopbackend.web.ProductDto;

import java.util.Collection;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/products")
public class ProductController {
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(path = "")
    public ResponseEntity<String> createProduct(@RequestBody ProductCreationDto productDto) {
        productService.assertEmployee(User.getAuthenticated());
        Product product = productDto.convertToModel();
        productService.validateAndSave(product);
        return ResponseEntity.status(HttpStatus.CREATED).body("");
    }

    @GetMapping(path = "")
    public ResponseEntity<Collection<ProductDto>> fetchProducts() {
        Collection<Product> products = productService.getAllProducts();
        return ResponseEntity.status(HttpStatus.OK).body(products.stream().map(ProductDto::valueFrom).toList());
    }

    @GetMapping(path = "/{productID}")
    public ResponseEntity<ProductDto> fetchProduct(@PathVariable UUID productID) {
        Product product = productService.getProduct(productID);
        return ResponseEntity.status(HttpStatus.OK).body(ProductDto.valueFrom(product));
    }

    @DeleteMapping(path = "/{productId}")
    public void deleteProduct(@PathVariable UUID productId) {
        log.info("Entered deleting node");
        productService.assertEmployee(User.getAuthenticated());
        log.info("Asserted employee");
        productService.deleteProduct(productId);
        log.info("Deleted product");
    }

}
