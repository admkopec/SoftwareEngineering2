package pw.se2.flowershopbackend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import pw.se2.flowershopbackend.models.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}