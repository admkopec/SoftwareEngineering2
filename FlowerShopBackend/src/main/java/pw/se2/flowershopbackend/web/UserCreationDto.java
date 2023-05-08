package pw.se2.flowershopbackend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.models.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.io.IOException;
import java.util.Objects;

// TODO: Maybe add account type, address, etc.?
public record UserCreationDto(@NotEmpty String name, @NotEmpty @Email String email, @NotEmpty String password,
                              Boolean newsletter, AddressDto address) {
    public User convertToModel() {
        User user = new User();
        user.setName(this.name);
        user.setEmail(this.email);
        user.setPassword(this.password);
        // Set role based on user's email
        String[] emailComponents = email.split("@");
        String domain = emailComponents[emailComponents.length-1];
        if (domain.equals("flowershop.com")) {
            user.setRole(User.Roles.Employee);
            user.setNewsletter(false);
        } else if (domain.equals("delivery.flowershop.com")) {
            user.setRole(User.Roles.DeliveryMan);
            user.setNewsletter(false);
        } else {
            user.setRole(User.Roles.Client);
            user.setNewsletter(Objects.requireNonNullElse(this.newsletter, false));
        }

        if (this.address != null) {
            String address;
            try {
                ObjectMapper mapper = new ObjectMapper();
                address = mapper.writeValueAsString(this.address);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Corrupted data in request");
            }
            user.setAddress(address);
        }

        return user;
    }
}
