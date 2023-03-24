package pw.se2.flowershopbackend.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.UserService;
import pw.se2.flowershopbackend.web.NewsletterSubscriptionDto;
import pw.se2.flowershopbackend.web.UserCreationDto;
import pw.se2.flowershopbackend.web.UserDto;

import javax.annotation.PostConstruct;

@RestController
@RequestMapping(path = "/api/users")
public class UserController {
    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    private void init() {
        userService.setPasswordEncoder(passwordEncoder);
    }

    @PostMapping(path = "")
    public ResponseEntity<UserDto> createUser(@RequestBody UserCreationDto userDto) {
        User user = userDto.convertToModel();
        user = userService.validateAndSave(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDto.valueFrom(user));
    }

    @GetMapping(path = "")
    public ResponseEntity<UserDto> fetchCurrentUser() {
        User user = User.getAuthenticated();
        return ResponseEntity.status(HttpStatus.OK).body(UserDto.valueFrom(user));
    }

    @PostMapping(path = "/newsletter")
    public ResponseEntity<String> updateNewsletterSubscription(@RequestBody NewsletterSubscriptionDto newsletterSubscriptionDto) {
        User user = User.getAuthenticated();
        userService.updateNewsletterStatus(newsletterSubscriptionDto.subscribed(), user);
        return ResponseEntity.status(HttpStatus.OK).body("");
    }
}
