package pw.se2.flowershopbackend.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import pw.se2.flowershopbackend.models.User;
import pw.se2.flowershopbackend.services.UserService;
import pw.se2.flowershopbackend.web.NewsletterSubscriptionDto;
import pw.se2.flowershopbackend.web.UserCreationDto;
import pw.se2.flowershopbackend.web.UserDto;

import javax.annotation.PostConstruct;

@Tag(name = "Users")
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

    @PostMapping(path = "", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Create new User", description =
            "This endpoint is will create a new User in the database." +
            "The role of such user will be selected automatically based on the domain of their email address." + "\n\n" +
            "If the email is in the _flowershop.com_ domain, then an Employee will be created." +
            "If the email is in the _delivery.flowershop.com_ domain, then Delivery Man will be created." +
            "Otherwise the User will be added as a regular Client to the database."
    )
    public ResponseEntity<UserDto> createUser(@RequestBody UserCreationDto userDto) {
        User user = userDto.convertToModel();
        user = userService.validateAndSave(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDto.valueFrom(user));
    }

    @GetMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get information about currently authenticated User")
    public ResponseEntity<UserDto> fetchCurrentUser() {
        User user = User.getAuthenticated();
        return ResponseEntity.status(HttpStatus.OK).body(UserDto.valueFrom(user));
    }

    @PostMapping(path = "/newsletter", consumes = MediaType.APPLICATION_JSON_VALUE)
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update newsletter preference")
    public void updateNewsletterSubscription(@RequestBody NewsletterSubscriptionDto newsletterSubscriptionDto) {
        User user = User.getAuthenticated();
        userService.updateNewsletterStatus(newsletterSubscriptionDto.subscribed(), user);
    }

    @PostMapping(path = "/profilePicture", consumes = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update profile picture")
    public void updateProfilePicture(@RequestBody byte[] image) {
        User user = User.getAuthenticated();
        userService.updateProfilePicture(image, user);
    }

    @GetMapping(path = "/profilePicture", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get profile picture")
    public ResponseEntity<byte[]> fetchProfilePicture() {
        User user = User.getAuthenticated();
        return ResponseEntity.status(HttpStatus.OK).body(user.getProfilePicture());
    }

    // TODO: Add the ability to save preferred address
}
