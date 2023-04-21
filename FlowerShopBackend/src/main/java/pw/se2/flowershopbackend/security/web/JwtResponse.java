package pw.se2.flowershopbackend.security.web;

import java.io.Serial;
import java.io.Serializable;

public record JwtResponse(String jwttoken) implements Serializable {
    @Serial
    private static final long serialVersionUID = -8091879091924046844L;
}
