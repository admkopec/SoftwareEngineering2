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
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import pw.se2.flowershopbackend.controllers.UserController;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserAddingApiTests {
    @TestConfiguration
    static class UserAddingApiTestsContextConfiguration {
        @Autowired
        private UserRepository userRepository;

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        public UserService userService() {
            return new UserService(userRepository);
        }
    }
    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private AuthenticationManager authenticationManager;

    private final List<User> users = new ArrayList<>();
    @BeforeEach
    public void setUp() {
        Mockito.when(userRepository.findByEmail(Mockito.any(String.class)))
                .thenAnswer(i -> {
                    String email = (String) i.getArguments()[0];
                    return users.stream().filter(e -> e.getEmail().equals(email)).findFirst();
                });
        Mockito.when(userRepository.save(Mockito.any(User.class)))
                .thenAnswer(i -> {
                    User user = (User) i.getArguments()[0];
                    this.users.add(user);
                    return user;
                });
    }

    @Test
    public void givenNullCredentials_whileCreatingUser_thenReturnUserDto() throws Exception {
        mvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test User\", \"email\":\"test.user@shop.com\", \"password\":\"1234\"}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.name", is("Test User")))
                .andExpect(jsonPath("$.email", is("test.user@shop.com")));
        Optional<User> user = users.stream().filter(e -> e.getEmail().equals("test.user@shop.com")).findFirst();
        assertNotNull(user);
        assertFalse(user.get().getNewsletter());
        assertEquals(user.get().getRole(), User.Roles.Client);
    }

    @Test
    public void givenNullCredentials_whileCreatingUserWithAllFields_thenReturnUserDto() throws Exception {
        mvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test User\", \"email\":\"test.user2@shop.com\", \"password\":\"1234\", \"newsletter\": true, \"address\": {\"street\":\"\",\"buildingNo\":\"\",\"houseNo\":\"\",\"city\":\"\",\"postalCode\":\"\",\"country\":\"Poland\"}}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.name", is("Test User")))
                .andExpect(jsonPath("$.email", is("test.user2@shop.com")))
                .andExpect(jsonPath("$.address").exists())
                .andExpect(jsonPath("$.address.country", is("Poland")));

        Optional<User> user = users.stream().filter(e -> e.getEmail().equals("test.user2@shop.com")).findFirst();
        assertNotNull(user);
        assertTrue(user.get().getNewsletter());
        assertEquals(user.get().getRole(), User.Roles.Client);
    }

    @Test
    public void givenNullCredentialsAndEmployeeDomain_whileCreatingUser_thenReturnUserDto() throws Exception {
        mvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test User\", \"email\":\"test.user@flowershop.com\", \"password\":\"1234\"}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.name", is("Test User")))
                .andExpect(jsonPath("$.email", is("test.user@flowershop.com")));
        Optional<User> user = users.stream().filter(e -> e.getEmail().equals("test.user@flowershop.com")).findFirst();
        assertNotNull(user);
        assertFalse(user.get().getNewsletter());
        assertEquals(user.get().getRole(), User.Roles.Employee);
    }

    @Test
    public void givenNullCredentialsAndDeliveryDomain_whileCreatingUser_thenReturnUserDto() throws Exception {
        mvc.perform(post("/api/users").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test User\", \"email\":\"test.user@delivery.flowershop.com\", \"password\":\"1234\"}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is2xxSuccessful())
                .andExpect(jsonPath("$.name", is("Test User")))
                .andExpect(jsonPath("$.email", is("test.user@delivery.flowershop.com")));
        Optional<User> user = users.stream().filter(e -> e.getEmail().equals("test.user@delivery.flowershop.com")).findFirst();
        assertNotNull(user);
        assertFalse(user.get().getNewsletter());
        assertEquals(user.get().getRole(), User.Roles.DeliveryMan);
    }
}
