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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import pw.se2.flowershopbackend.controllers.ProductController;
import pw.se2.flowershopbackend.dao.ProductRepository;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.ProductService;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ProductAddingIntegrationTests {
    @TestConfiguration
    static class ProductAddingApiTestsContextConfiguration {
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

    private final User user = new User();
    private final User employee = new User();
    @BeforeEach
    public void setUp() {
        user.setName("Test User");
        user.setEmail("test@shop.com");
        user.setPassword(new BCryptPasswordEncoder().encode("1234"));
        employee.setName("Test Employee");
        employee.setEmail("employee@shop.com");
        employee.setPassword(new BCryptPasswordEncoder().encode("5678"));
        employee.setRole(User.Roles.Employee);
        Mockito.when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        Mockito.when(userRepository.findByEmail(employee.getEmail()))
                .thenReturn(Optional.of(employee));
    }

    @Test
    public void givenInvalidCredentials_whileAddingProduct_thenReturnError() throws Exception {
        try {
            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                    user, null, employee.getAuthorities()
            ));
            mvc.perform(post("/api/products").contentType(MediaType.APPLICATION_JSON)
                            .content("{\"productID\":\"A9007774-CA6F-4D99-9E58-A3913988F1DD\",\"name\":\"Daisy\", \"description\":\"Description\", \"image\":\"\", \"price\":15.0}")
                            .accept(MediaType.APPLICATION_JSON))
                    .andExpect(status().is4xxClientError())
                    .andExpect(result -> assertNotNull(result.getResolvedException()))
                    .andExpect(result -> assertTrue(result.getResolvedException().getMessage().contains("User is not authorized to add products")));
        } catch (Exception exception) {
            assertTrue(exception.getMessage().contains("User is not authorized to add products"), exception.getMessage());
        }
    }

    @Test
    public void givenValidCredentials_whileAddingProduct_thenReturnError() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                employee, null, employee.getAuthorities()
        ));
        mvc.perform(post("/api/products").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productID\":\"A9007774-CA6F-4D99-9E58-A3913988F1DD\",\"name\":\"Daisy\", \"description\":\"Description\", \"image\":\"\", \"price\":15.0}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful());
    }
}
