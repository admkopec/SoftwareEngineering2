package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.BasketItemRepository;
import pw.se2.flowershopbackend.models.BasketItem;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BasketItemService {
    private static final Logger log = LoggerFactory.getLogger(BasketItemService.class);

    private final BasketItemRepository basketItemRepository;

    public BasketItemService(BasketItemRepository basketItemRepository){
        this.basketItemRepository = basketItemRepository;
    }

    public List<BasketItem> getBasketByUser(User user){
        Optional<List<BasketItem>> optionalBasketItems = basketItemRepository.findByClient(user);
        if (optionalBasketItems.isPresent()) {
            List<BasketItem> basketItems = optionalBasketItems.get();
            // Verify the user is authorized to fetch their basket
            if (basketItems.stream().allMatch((basketItem ->
                    basketItem.getClient().equals(user))))
                return basketItems;
            else {
                log.error("User not authorized to perform this action.");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized to perform this action.");
            }
        } else
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No such basket.");
    }

    public void deleteBasketItem(Product product, User user) {
        Optional<BasketItem> basketItemOptional = basketItemRepository.findByClientAndProduct(user, product);
        if (basketItemOptional.isPresent()){
            BasketItem basketItem = basketItemOptional.get();
            basketItemRepository.delete(basketItem);
        }
        else {
            log.error("Could not find item to delete.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found.");
        }
        log.info("Item from basket removed successfully.");
    }

    public void deleteAllBasketItems(List<BasketItem> basketItems){
        if (basketItems.stream().allMatch((basketItem) ->
            this.isBasketItemValid(basketItem) && basketItemRepository.existsById(basketItem.getId())
        )) {
            basketItemRepository.deleteAll(basketItems);
        }
        log.error("Could not delete - invalid request.");
    }

    public boolean isBasketItemValid(BasketItem basket) {
        if (basket != null) {
            if (basket.getProduct() == null) {
                log.error("Null product id.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Null product id.");
            }
            if (basket.getClient() == null) {
                log.error("Null user id.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Null product id.");
            }
            if (basket.getQuantity() < 0){
                log.error("Negative quantity.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Negative quantity.");
            }
            return true;
        }
        log.error("BasketItem is null.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "BasketItem is null.");
    }

    public void validateAndSave(BasketItem basketItem) {
        if (isBasketItemValid(basketItem)) {
            log.info("BasketItem is valid");
            basketItemRepository.save(basketItem);
            log.info("Order was saved.");
        }
    }

}
