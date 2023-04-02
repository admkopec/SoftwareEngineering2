package pw.se2.flowershopbackend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.services.ProductService;
import pw.se2.flowershopbackend.web.ProductCreationDto;
import pw.se2.flowershopbackend.web.ProductDto;

@RestController
@RequestMapping(path = "/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(path = "")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductCreationDto productDto) {
        Product product = productDto.convertToModel();
        product = productService.validateAndSave(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(ProductDto.valueFrom(product));
    }
}
