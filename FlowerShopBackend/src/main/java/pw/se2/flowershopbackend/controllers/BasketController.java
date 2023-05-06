package pw.se2.flowershopbackend.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.web.BasketDto;

import java.util.Collection;
import java.util.UUID;

@Tag(name = "Basket")
@RestController
@RequestMapping(path = "/api/basket")
public class BasketController {
    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Fetch Products", description = "Get list of all products and their quantity in basket for current User.")
    public ResponseEntity<Collection<BasketDto>> fetchItems() {
        User user = User.getAuthenticated();
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Not yet implemented.");
    }

    @DeleteMapping(path = "/{productId}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Remove Product", description = "Removes specified Product from basket of current User.")
    public void removeItem(@PathVariable UUID productId) {
        User user = User.getAuthenticated();
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Not yet implemented.");
    }

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add Product", description = "Adds specified Product with quantity to basket of current User.")
    public void addItem(@RequestBody BasketDto basketDto) {
        User user = User.getAuthenticated();
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Not yet implemented.");
    }

    @DeleteMapping(path = "")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Remove all Products", description = "Removes all Products from basket of current User.")
    public void removeAllItems() {
        User user = User.getAuthenticated();
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Not yet implemented.");
    }
}
