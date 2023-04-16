package pw.se2.flowershopbackend.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table
public class Order {
    public enum Status {
      accepted,
        declined,
        delivered,

    }

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "BINARY(16) DEFAULT (UUID_TO_BIN(UUID()))")
    private UUID id;

    @Column(nullable = false)
    private String address;

    //optional
    @Column
    private Status status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id", nullable = false, columnDefinition = "BINARY(16)")
    private User client;

    @ManyToOne
    @JoinColumn(name = "deliveryMan_id", columnDefinition = "BINARY(16)")
    private User deliveryMan;

    @OneToMany(mappedBy = "order", orphanRemoval = true)
    private Set<OrderProduct> orderProducts = new LinkedHashSet<>();

    public Set<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(Set<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public User getDeliveryMan() {
        return deliveryMan;
    }

    public void setDeliveryMan(User deliveryMan) {
        this.deliveryMan = deliveryMan;
    }

    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String Address) {
        this.address = address;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
