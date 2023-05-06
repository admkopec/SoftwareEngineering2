package pw.se2.flowershopbackend.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import pw.se2.flowershopbackend.models.User;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import java.io.IOException;
import java.util.UUID;

public record UserDto(UUID id, @NotEmpty String name, @Email String email, User.Roles role, AddressDto address) {
    public static UserDto valueFrom(User user) {
        AddressDto address = null;
        if (user.getAddress() != null && !user.getAddress().isBlank()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                address = mapper.readValue(user.getAddress(), AddressDto.class);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Corrupted data in database.");
            }
        }
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole(), address);
    }
}
