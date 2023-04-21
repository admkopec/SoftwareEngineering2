package pw.se2.flowershopbackend.web;

import javax.validation.constraints.NotEmpty;

public record AddressDto(@NotEmpty String street, @NotEmpty String buildingNo, @NotEmpty String houseNo,
                         @NotEmpty String postalCode, @NotEmpty String city, @NotEmpty String country) {
}
