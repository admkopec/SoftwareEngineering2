package pw.se2.flowershopbackend.models;

import javax.persistence.*;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table
public class User implements UserDetails {

    public enum Roles
    {
        Client,
        Employee,
        DeliveryMan
    }

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "BINARY(16) DEFAULT (UUID_TO_BIN(UUID()))")
    private UUID id;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(columnDefinition = "VARCHAR(2048)")
    private String address;
    @Column(nullable = false)
    private Roles role;

    @Column(nullable = false)
    private boolean newsletter;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] profilePicture;

    @OneToMany(mappedBy = "client", orphanRemoval = true)
    private Set<Order> orders = new LinkedHashSet<>();

    @OneToMany(mappedBy = "deliveryMan", orphanRemoval = true)
    private Set<Order> ordersToDeliver = new LinkedHashSet<>();

    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public Roles getRole() {
        return role;
    }
    public void setRole(Roles role) {
        this.role = role;
    }

    public boolean getNewsletter() {
        return newsletter;
    }
    public void setNewsletter(boolean newsletter) {
        this.newsletter = newsletter;
    }

    public byte[] getProfilePicture() {
        return profilePicture;
    }
    public void setProfilePicture(byte[] profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Set<Order> getOrders() {
        return orders;
    }

    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }

    public Set<Order> getOrdersToDeliver() {
        return ordersToDeliver;
    }

    public void setOrdersToDeliver(Set<Order> ordersToDeliver) {
        this.ordersToDeliver = ordersToDeliver;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return true;
    }

    public boolean equals(Object obj) {
        return obj instanceof User && this.email.equals(((User) obj).email);
    }
    public int hashCode() {
        return this.email.hashCode();
    }

    public static User getAuthenticated() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
