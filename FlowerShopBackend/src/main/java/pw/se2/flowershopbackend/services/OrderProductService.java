package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.OrderProductRepository;
import pw.se2.flowershopbackend.models.OrderProduct;
import java.util.Set;

@Service
public class OrderProductService {
    private static final Logger log = LoggerFactory.getLogger(OrderProductService.class);
    private final OrderProductRepository orderProductRepository;

    public OrderProductService(OrderProductRepository orderProductRepository) {
        this.orderProductRepository = orderProductRepository;
    }

    public boolean isOrderProductValid(OrderProduct orderProduct) {
        if (orderProduct != null) {
            if (orderProduct.getQuantity() < 0) {
                log.error("Negative product quantity.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Negative product quantity.");
            }
            return true;
        }
        log.error("OrderProduct is null.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OrderProduct is null.");
    }

    public void validateAndSave(OrderProduct orderProduct) {
        if (isOrderProductValid(orderProduct)) {
            log.info("OrderProduct is valid");
            orderProductRepository.save(orderProduct);
            log.info("OrderProduct was saved.");
        }
    }

    public void validateAndSaveAll(Set<OrderProduct> orderProducts) {
        if (orderProducts.stream().allMatch(this::isOrderProductValid)) {
            log.info("OrderProducts are valid");
            orderProductRepository.saveAll(orderProducts);
            log.info("OrderProducts were saved.");
        }
    }
}
