package pw.se2.flowershopbackend;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "FlowerShop API", description = "Backend for the FlowerShop project."))
public class FlowerShopBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlowerShopBackendApplication.class, args);
    }

}
