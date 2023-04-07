package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.User;

import java.util.Optional;

public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public User validateAndSave(User user) {
        if (isValidUser(user)) {
            log.info("User is valid");
            Optional<User> dbUser = userRepository.findByEmail(user.getEmail());
            if (dbUser.isPresent()) {
                log.info("User already exists. Updating it.");
                user.setId(dbUser.get().getId());
            } else {
                if (passwordEncoder != null) {
                    log.debug("Encoding password.");
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                }
            }
            user = userRepository.save(user);
            log.info("User was saved.");
        }
        return user;
    }

    public void updateNewsletterStatus(boolean isSubscribed, User user) {
        user.setNewsletter(isSubscribed);
        userRepository.save(user);
        log.info("User was saved after update.");
    }

    public void updateProfilePicture(byte[] image, User user) {
        user.setProfilePicture(image);
        userRepository.save(user);
        log.info("User was saved after update.");
    }

    private boolean isValidUser(User user) {
        if (user != null) {
            if (isInvalid(user.getEmail()) || isInvalid(user.getUsername())) {
                log.error("Empty user email.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty user email.");
            }
            if (isInvalid(user.getPassword())) {
                log.error("Empty user password.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty user password.");
            }
            return true;
        }
        log.error("User is null.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is null.");
    }

    // MARK: - Helpers
    private boolean isInvalid(String value) {
        return value == null || value.isBlank();
    }
}
