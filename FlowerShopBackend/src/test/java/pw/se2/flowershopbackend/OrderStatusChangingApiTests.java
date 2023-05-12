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
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.*;

import java.util.Optional;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
public class OrderStatusChangingApiTests {
    @TestConfiguration
    static class OrderStatusChangingApiTestsContextConfiguration {
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

    private final Order order = new Order();

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

        order.setClient(user);
        Mockito.when(orderRepository.findById(order.getId()))
                .thenReturn(Optional.of(order));
    }

    @Test
    public void tryChangingOrderStatusAsClient() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities()
        ));
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                .content("{\"orderStatus\": \"accepted\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"declined\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"delivered\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void tryChangingOrderStatusAsEmployee() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                employee, null, employee.getAuthorities()
        ));
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"accepted\"}"))
                .andExpect(status().is2xxSuccessful());
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"declined\"}"))
                .andExpect(status().is2xxSuccessful());
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"delivered\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void tryChangingOrderStatusAsDeliveryMan() throws Exception {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                deliveryMan, null, deliveryMan.getAuthorities()
        ));
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"accepted\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"declined\"}"))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"delivered\"}"))
                .andExpect(status().isForbidden());
        order.setDeliveryMan(deliveryMan);
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"delivered\"}"))
                .andExpect(status().isBadRequest());
        order.setStatus(Order.Status.Accepted);
        mvc.perform(post("/api/orders/"+order.getId()+"/change_status").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"orderStatus\": \"delivered\"}"))
                .andExpect(status().is2xxSuccessful());
    }
}
