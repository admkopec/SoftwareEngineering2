package pw.se2.flowershopbackend.web;

import pw.se2.flowershopbackend.models.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

// TODO: Maybe add account type, address, etc.?
public record UserCreationDto(@NotEmpty String name, @NotEmpty @Email String email, @NotEmpty String password,
                              @NotEmpty boolean newsletter) {
    public User convertToModel() {
        User user = new User();
        user.setName(this.name());
        user.setEmail(this.email());
        user.setPassword(this.password());
        user.setRole(User.Roles.Client);
        user.setNewsletter(this.newsletter());

        // TODO: Set other properties
        return user;
    }
}
