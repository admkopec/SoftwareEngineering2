package pw.se2.flowershopbackend;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.junit4.SpringRunner;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.security.services.JwtTokenService;
import pw.se2.flowershopbackend.security.services.JwtUserDetailsService;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Optional;

import static junit.framework.TestCase.*;
import static org.junit.jupiter.api.Assertions.assertThrows;

@RunWith(SpringRunner.class)
public class UserAuthenticationIntegrationTests {
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
    }

    @Autowired
    private JwtTokenService tokenService;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @MockBean
    private UserRepository userRepository;

    @Before
    public void setUp() {
        User user = new User();
        user.setName("Test User");
        user.setEmail("test@shop.com");
        user.setPassword("1234");
        Mockito.when(userRepository.findByEmail(user.getEmail()))
                .thenReturn(Optional.of(user));
    }

    @Test
    public void whenValidUsername_thenUserShouldBeFound() {
        String username = "test@shop.com";

        User user = (User)userDetailsService.loadUserByUsername(username);

        assertEquals("Test User", user.getName());
    }

    @Test
    public void whenValidUsername_thenValidTokenShouldBeGenerated() {
        String username = "test@shop.com";

        UserDetails user = userDetailsService.loadUserByUsername(username);

        String token = tokenService.generateToken(user);
        String extractedUsername = tokenService.getUsernameFromToken(token);

        assertEquals(username, extractedUsername);
        assertTrue(tokenService.validateToken(token, user));
    }

    @Test
    public void whenProvidedExpiredToken_thenInvalidTokenShallBeDetected() throws InterruptedException {
        String username = "test@shop.com";

        UserDetails user = userDetailsService.loadUserByUsername(username);

        String token = tokenService.generateToken(user);

        Thread.sleep(1000);

        assertThrows(ExpiredJwtException.class, () -> {
            String extractedUsername = tokenService.getUsernameFromToken(token);
        });

        assertThrows(ExpiredJwtException.class, () -> {
            assertFalse(tokenService.validateToken(token, user));
        });
    }
}
