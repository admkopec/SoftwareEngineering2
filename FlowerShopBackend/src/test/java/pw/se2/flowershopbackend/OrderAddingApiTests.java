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
import pw.se2.flowershopbackend.controllers.OrderController;
import pw.se2.flowershopbackend.dao.OrderProductRepository;
import pw.se2.flowershopbackend.dao.OrderRepository;
import pw.se2.flowershopbackend.dao.ProductRepository;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.Product;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.*;

import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OrderAddingApiTests {
    @TestConfiguration
    static class OrderAddingApiTestsContextConfiguration {
        @Autowired
        private UserRepository userRepository;
        @Autowired
        private ProductRepository productRepository;
        @Autowired
        private OrderRepository orderRepository;
        @Autowired
        private OrderProductRepository orderProductRepository;

        @Bean
        public UserService userService() {
            return new UserService(userRepository);
        }

        @Bean
        ProductService productService() {
            return new ProductService(productRepository);
        }

        @Bean
        public AlgorithmService algorithmService() {
            return new AlgorithmService(userRepository, orderRepository);
        }

        @Bean
        public OrderService orderService(UserService userService, AlgorithmService algorithmService, OrderProductService orderProductService) {
            return new OrderService(orderRepository, userService, algorithmService, orderProductService);
        }

        @Bean
        public OrderProductService orderProductService() {
            return new OrderProductService(orderProductRepository);
        }
    }

    @Autowired
    private MockMvc mvc;

    @MockBean
    private OrderRepository orderRepository;
    @MockBean
    private OrderProductRepository orderProductRepository;
    @MockBean
    private UserRepository userRepository;
    @MockBean
    private ProductRepository productRepository;
    @MockBean
    private AuthenticationManager authenticationManager;

    private final User user = new User();
    private final User employee = new User();
    private final User deliveryMan = new User();

    private final Product product = new Product();

    @BeforeEach
    public void setUp() {
        user.setName("Test User");
        user.setEmail("test@shop.com");
        user.setPassword(new BCryptPasswordEncoder().encode("1234"));
        user.setRole(User.Roles.Client);
        employee.setName("Test Employee");
        employee.setEmail("employee@shop.com");
        employee.setPassword(new BCryptPasswordEncoder().encode("5678"));
        employee.setRole(User.Roles.Employee);
        deliveryMan.setName("Test Delivery");
        deliveryMan.setEmail("delivery@shop.com");
        deliveryMan.setPassword(new BCryptPasswordEncoder().encode("9012"));
        deliveryMan.setRole(User.Roles.DeliveryMan);
        product.setName("Forget me not");
        product.setDescription("Spring flower");
        product.setCategory(Product.Category.Flower);
        product.setQuantity(10);
        product.setPrice(3.5);
        Mockito.when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        Mockito.when(userRepository.findByEmail(employee.getEmail()))
                .thenReturn(Optional.of(employee));
        Mockito.when(userRepository.findByEmail(deliveryMan.getEmail()))
                .thenReturn(Optional.of(deliveryMan));
        Mockito.when(productRepository.getById(product.getId()))
                .thenReturn(product);
        Mockito.when(productRepository.existsById(product.getId()))
                .thenReturn(true);
        Mockito.when(productRepository.findById(product.getId()))
                .thenReturn(Optional.of(product));
    }

    @Test
    public void tryAddingOrderAsEmployee() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                employee, null, employee.getAuthorities()
        ));
        mvc.perform(post("/api/orders")
                        .content("{\"deliveryAddress\": {\"street\":\"\",\"buildingNo\":\"\",\"houseNo\":\"\",\"city\":\"\",\"postalCode\":\"\",\"country\":\"\"}, \"items\":[{\"productID\":\"" + product.getId() + "\", \"quantity\": 5}]}")
                        .accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError())
                .andExpect(result -> assertNotNull(result.getResolvedException()));
                //.andExpect(result -> assertTrue(result.getResolvedException().getMessage().contains("Employee is not authorized to order product")));
    }
    @Test
    public void tryAddingOrderAsDeliveryMan() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                deliveryMan, null, deliveryMan.getAuthorities()
        ));
        mvc.perform(post("/api/orders")
                        .content("{\"deliveryAddress\": {\"street\":\"\",\"buildingNo\":\"\",\"houseNo\":\"\",\"city\":\"\",\"postalCode\":\"\",\"country\":\"\"}, \"items\":[{\"productID\":\"" + product.getId() + "\", \"quantity\": 5}]}")
                        .accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError())
                .andExpect(result -> assertNotNull(result.getResolvedException()));
        //.andExpect(result -> assertTrue(result.getResolvedException().getMessage().contains("Employee is not authorized to order product")));
    }

    @Test
    public void tryAddingInvalidOrderAsClient() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities()
        ));
        mvc.perform(post("/api/orders")
                        .content("{\"deliveryAddress\": {\"street\":\"\",\"buildingNo\":\"\",\"houseNo\":\"\",\"city\":\"\",\"postalCode\":\"\",\"country\":\"\"}, \"items\":[{\"productID\":\"" + product.getId() + "\", \"quantity\": 200}]}")
                        .accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError())
                .andExpect(result -> assertNotNull(result.getResolvedException()));
        //.andExpect(result -> assertTrue(result.getResolvedException().getMessage().contains("Employee is not authorized to order product")));
    }

    @Test
    public void tryAddingValidOrderAsClient() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities()
        ));
        mvc.perform(post("/api/orders")
                        .content("{\"deliveryAddress\": {\"street\":\"\",\"buildingNo\":\"\",\"houseNo\":\"\",\"city\":\"\",\"postalCode\":\"\",\"country\":\"\"}, \"items\":[{\"productID\":\"" + product.getId() + "\", \"quantity\": 5}]}")
                        .accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful());
                //.andExpect(result -> assertNotNull(result.getResolvedException()));
        //.andExpect(result -> assertTrue(result.getResolvedException().getMessage().contains("Employee is not authorized to order product")));
    }

    @Test
    public void tryAddingOrderInvalidProduct() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities()
        ));
        mvc.perform(post("/api/orders")
                        .content("{\"deliveryAddress\": {\"street\":\"\",\"buildingNo\":\"\",\"houseNo\":\"\",\"city\":\"\",\"postalCode\":\"\",\"country\":\"\"}, \"items\":[{\"productID\":\"" + UUID.randomUUID() + "\", \"quantity\": 5}]}")
                        .accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError())
                .andExpect(result -> assertNotNull(result.getResolvedException()));

    }
}
