package pw.se2.flowershopbackend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import pw.se2.flowershopbackend.controllers.ProductController;
import pw.se2.flowershopbackend.dao.ProductRepository;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.services.ProductService;

import java.util.Arrays;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProductFetchingApiTests {
    @TestConfiguration
    static class ProductFetchingApiTestsContextConfiguration {
        @Autowired
        private ProductRepository productRepository;

        @Bean
        public ProductService productService() {
            return new ProductService(productRepository);
        }
    }
    @Autowired
    private MockMvc mvc;

    @MockBean
    private ProductRepository productRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private AuthenticationManager authenticationManager;

    Product product1 = new Product(UUID.randomUUID());
    Product product2 = new Product(UUID.randomUUID());
    @BeforeEach
    public void setUp() {
        product1.setName("Daisy");
        product1.setDescription("Description one");
        product1.setPrice(15.0);
        product2.setName("Sunflower");
        product2.setDescription("Description two");
        product2.setPrice(23.5);
        Mockito.when(productRepository.getById(product1.getId()))
                .thenReturn(product1);
        Mockito.when(productRepository.getById(product2.getId()))
                .thenReturn(product2);
        Mockito.when(productRepository.existsById(product1.getId()))
                .thenReturn(true);
        Mockito.when(productRepository.existsById(product2.getId()))
                .thenReturn(true);
        Mockito.when(productRepository.findAll())
                .thenReturn(Arrays.asList(product1, product2));
    }

    @Test
    public void tryFetchingAllProducts() throws Exception {
        mvc.perform(get("/api/products")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    public void tryFetchingOneProduct() throws Exception {
        mvc.perform(get("/api/products/" + product1.getId())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.productID").exists());
    }
}
