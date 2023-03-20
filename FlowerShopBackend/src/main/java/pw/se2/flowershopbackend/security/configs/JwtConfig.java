package pw.se2.flowershopbackend.security.configs;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.web.filter.OncePerRequestFilter;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.security.filters.JwtAuthenticationEntryPoint;
import pw.se2.flowershopbackend.security.filters.JwtRequestFilter;
import pw.se2.flowershopbackend.security.services.JwtTokenService;
import pw.se2.flowershopbackend.security.services.JwtUserDetailsService;

import javax.annotation.PostConstruct;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String signingKey;
    private long expirationMs;

    @Bean
    public JwtUserDetailsService jwtUserDetailsService(UserRepository userRepository) {
        return new JwtUserDetailsService(userRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtTokenService jwtTokenService() throws NoSuchAlgorithmException, InvalidKeySpecException {
        return new JwtTokenService(signingKey, expirationMs);
    }

    @Bean
    public OncePerRequestFilter jwtRequestFilter(UserRepository userRepository) throws NoSuchAlgorithmException, InvalidKeySpecException {
        return new JwtRequestFilter(jwtUserDetailsService(userRepository), jwtTokenService());
    }

    @Bean
    public AuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    public void setSigningKey(String signingKey) {
        this.signingKey = signingKey;
    }
    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }
}
