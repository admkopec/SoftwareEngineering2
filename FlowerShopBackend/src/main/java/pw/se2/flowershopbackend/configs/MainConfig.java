package pw.se2.flowershopbackend.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.services.UserService;
import pw.se2.flowershopbackend.dao.ProductRepository;
import pw.se2.flowershopbackend.services.ProductService;

@Configuration
public class MainConfig {
    @Bean
    public UserService userService(UserRepository userRepository) {
        return new UserService(userRepository);
    }

    @Bean
    public ProductService productService(ProductRepository productRepository) {
        return new ProductService(productRepository);
    }

}
