package pw.se2.flowershopbackend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import pw.se2.flowershopbackend.controllers.OrderController;
import pw.se2.flowershopbackend.dao.OrderProductRepository;
import pw.se2.flowershopbackend.dao.OrderRepository;
import pw.se2.flowershopbackend.dao.ProductRepository;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.*;

import java.util.Optional;

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
            return new AlgorithmService();
        }

        @Bean
        public OrderService orderService(UserService userService, AlgorithmService algorithmService) {
            return new OrderService(orderRepository, userService, algorithmService);
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
        Mockito.when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
        Mockito.when(userRepository.findByEmail(employee.getEmail()))
                .thenReturn(Optional.of(employee));
        Mockito.when(userRepository.findByEmail(deliveryMan.getEmail()))
                .thenReturn(Optional.of(deliveryMan));
    }

    // TODO: Add some tests
}
