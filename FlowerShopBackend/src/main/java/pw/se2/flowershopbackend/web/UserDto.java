package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.util.UUID;

// TODO: Maybe add account type (User.Role)?
public record UserDto(UUID id, @NotEmpty String name, @Email String email, String address) {
    public static UserDto valueFrom(User user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getAddress());
    }
}
