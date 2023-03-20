package pw.se2.flowershopbackend;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.security.controllers.JwtAuthenticationController;
import pw.se2.flowershopbackend.security.services.JwtTokenService;
import pw.se2.flowershopbackend.security.services.JwtUserDetailsService;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Optional;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(JwtAuthenticationController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserAuthenticationApiTests {
    @TestConfiguration
    static class UserAuthenticationIntegrationTestsContextConfiguration {
        @Autowired
        private UserRepository userRepository;

        @Bean
        public JwtTokenService tokenService() throws NoSuchAlgorithmException, InvalidKeySpecException {
            String key = "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgBUWL6aSQzmCeJZAo" +
                    "Sh7l7zNMflytL75k9WtVPxu/zlShRANCAARb834wUS3lCtKGMZFdQYDzhGH4htbs" +
                    "2y2W5lnxZzo3EQe0dTBu7hXbYcHgkm9Mq4h900bG4RZYAju6DL+04S/H";
            return new JwtTokenService(key, 1000);
        }

        @Bean
        public JwtUserDetailsService userDetailsService() {
            return new JwtUserDetailsService(userRepository);
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
            // configure AuthenticationManager so that it knows from where to load user for matching credentials
            return authenticationConfiguration.getAuthenticationManager();
        }
    }
    @Autowired
    private MockMvc mvc;

    @MockBean
    private UserRepository userRepository;

    @Before
    public void setUp() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@shop.com");
        user.setPassword(new BCryptPasswordEncoder().encode("1234"));
        Mockito.when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
    }

    // write test cases here
    @Test
    public void givenValidCredentials_whenLogin_thenReturnValidJwt() throws Exception {
        mvc.perform(post("/api/users/log_in")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test@shop.com\",\"password\":\"1234\"}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwttoken").exists());
    }

    @Test(expected = Exception.class)
    public void givenInvalidCredentials_whenLogin_thenReturnError() throws Exception {
        mvc.perform(post("/api/users/log_in")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"test@shop.com\",\"password\":\"12345\"}")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().is4xxClientError())
                .andExpect(jsonPath("$.jwttoken").doesNotExist());
    }
}
