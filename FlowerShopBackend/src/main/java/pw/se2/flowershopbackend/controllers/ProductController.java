package pw.se2.flowershopbackend.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.ProductService;
import pw.se2.flowershopbackend.web.ProductCreationDto;
import pw.se2.flowershopbackend.web.ProductDto;

import javax.validation.constraints.PositiveOrZero;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Tag(name = "Products")
@RestController
@RequestMapping(path = "/api/products")
public class ProductController {
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create new Product")
    public void createProduct(@RequestBody ProductCreationDto productDto) {
        productService.assertEmployee(User.getAuthenticated());
        Product product = productDto.convertToModel();
        productService.validateAndSave(product);
    }

    @PutMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create multiple new Products")
    public void createProducts(@RequestBody List<ProductCreationDto> productDtos) {
        productService.assertEmployee(User.getAuthenticated());
        List<Product> products = productDtos.stream().map(ProductCreationDto::convertToModel).toList();
        productService.validateAndSaveMany(products);
    }

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Fetch Products", description = "This endpoint will return the list of all products matching provided criteria.")
    public ResponseEntity<Collection<ProductDto>> fetchProducts(@Parameter(name = "Search Query", description = "The search string query that will be matched against product name", example = "rose")
                                                                @RequestParam(required = false) String search,
                                                                @Parameter(name = "Filtered categories", description = "The list of categories (comma separated string values) (available categories: 'flower', 'bouquet', 'groundFlower', 'supplement')", example = "flower,bouquet")
                                                                @RequestParam(required = false) String category,
                                                                @Parameter(name = "Minimum price", description = "The minimum price for a product selected", example = "5")
                                                                @RequestParam(required = false) @PositiveOrZero Integer minPrice,
                                                                @Parameter(name = "Maximum price", description = "The maximum price for a product selected", example = "20")
                                                                @RequestParam(required = false) @PositiveOrZero Integer maxPrice,
                                                                @Parameter(name = "Page number", description = "The number of the page to be displayed")
                                                                @RequestParam(defaultValue = "0") @PositiveOrZero Integer page,
                                                                @Parameter(name = "Maximum number of elements on page", description = "The number of elements per page that will not be exceeded")
                                                                @RequestParam(defaultValue = "30") @PositiveOrZero Integer maxPerPage) {
        Pageable paging = PageRequest.of(page, maxPerPage);
        Collection<Product> products = productService.getFilteredProducts(search, category, minPrice,
                maxPrice, paging).getContent();
        return ResponseEntity.status(HttpStatus.OK).body(products.stream().map(ProductDto::valueFrom).toList());
    }

    @GetMapping(path = "/{productId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Fetch a specific Product")
    public ResponseEntity<ProductDto> fetchProduct(@PathVariable UUID productId) {
        Product product = productService.getProductById(productId);
        return ResponseEntity.status(HttpStatus.OK).body(ProductDto.valueFrom(product));
    }

    @DeleteMapping(path = "/{productId}")
    @Operation(summary = "Delete Product")
    public void deleteProduct(@PathVariable UUID productId) {
        productService.assertEmployee(User.getAuthenticated());
        productService.deleteProduct(productId);
    }

    @PutMapping(path = "/{productId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Modify Product")
    public void modifyProduct(@PathVariable UUID productId, @RequestBody ProductCreationDto productDto) {
        productService.assertEmployee(User.getAuthenticated());
        Product product = productDto.convertToModel();
        product.setId(productId);
        productService.validateAndSave(product);
    }
}