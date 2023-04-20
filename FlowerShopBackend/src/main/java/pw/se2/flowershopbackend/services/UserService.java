package pw.se2.flowershopbackend.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.dao.UserRepository;
import pw.se2.flowershopbackend.models.Order;
import pw.se2.flowershopbackend.models.User;
import java.util.Optional;
import java.util.UUID;

@Service
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
        if (isUserValid(user)) {
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

    public User getUserById(UUID userId){
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            log.info("User is not present in the database.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User is not present in the database.");
        } else
            return user.get();
    }

    public boolean isUserValid(User user) {
        if (user != null) {
            if (user.getEmail().isBlank() || user.getUsername().isBlank()) {
                log.error("Empty user email.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty user email.");
            }
            if (user.getPassword().isBlank()) {
                log.error("Empty user password.");
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Empty user password.");
            }
            return true;
        }
        log.error("User is null.");
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is null.");
    }

    public void notify(User user, Order.Status newStatus) {
        // TODO: Implement
    }
}
