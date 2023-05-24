package pw.se2.flowershopbackend.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.models.BasketItem;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.BasketItemService;
import pw.se2.flowershopbackend.services.ProductService;
import pw.se2.flowershopbackend.web.BasketItemCreationDto;
import pw.se2.flowershopbackend.web.BasketDto;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Tag(name = "BasketItem")
@RestController
@SecurityRequirement(name = "Bearer Authentication")
@RequestMapping(path = "/api/basket")
public class BasketController {
    private final BasketItemService basketItemService;
    private final ProductService productService;

    // NOTE: the basket should probably be cleared for a user every once in a while, to offload the backend db
    public BasketController(ProductService productService, BasketItemService basketItemService){
        this.productService = productService;
        this.basketItemService = basketItemService;
    }

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Fetch Products", description = "Get list of all products and their quantity in basket for current User.")
    public ResponseEntity<Collection<BasketDto>> fetchItems() {
        User user = User.getAuthenticated();
        List<BasketItem> basketItemsList = basketItemService.getBasketByUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(basketItemsList.stream().map(BasketDto::valueFrom).toList());
    }

    @DeleteMapping(path = "/{productId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Remove Product", description = "Removes specified Product from basket of current User.")
    public void removeItem(@PathVariable UUID productId) {
        User user = User.getAuthenticated();
        basketItemService.deleteBasketItem(productService.getProductById(productId), user);
    }

    @PutMapping(path = "/{productId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update Product", description = "Updates the product (its quantity) in the basket of current User.")
    public void updateItem(@RequestBody BasketItemCreationDto basketItemCreationDto, @PathVariable UUID productId) {
        User user = User.getAuthenticated();
        BasketItem basketItem = basketItemCreationDto.convertToModel(productService);
        basketItem.setProduct(productService.getProductById(productId));
        basketItem.setClient(user);
        basketItemService.validateAndSave(basketItem);
    }

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add Product", description = "Adds specified Product with quantity to basket of current User.")
    public void addItem(@RequestBody BasketItemCreationDto basketItemCreationDto) {
        User user = User.getAuthenticated();
        BasketItem basketItem = basketItemCreationDto.convertToModel(productService);
        basketItem.setClient(user);
        basketItemService.validateAndSave(basketItem);
    }

    @DeleteMapping(path = "")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Remove all Products", description = "Removes all Products from basket of current User.")
    public void removeAllItems() {
        User user = User.getAuthenticated();
        List<BasketItem> basketItemList = basketItemService.getBasketByUser(user);
        basketItemService.deleteAllBasketItems(basketItemList);
    }
}
