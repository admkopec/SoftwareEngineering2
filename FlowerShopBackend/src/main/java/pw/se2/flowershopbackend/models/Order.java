package pw.se2.flowershopbackend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "client_order")
public class Order {
    public enum Status {
        @JsonProperty("accepted")
        Accepted,
        @JsonProperty("declined")
        Declined,
        @JsonProperty("delivered")
        Delivered
    }

    @Id
//    Excluded auto-generation
//    @GeneratedValue(generator = "UUID")
//    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "BINARY(16) DEFAULT (UUID_TO_BIN(UUID()))")
    private UUID id;

    @Column(nullable = false, columnDefinition = "VARCHAR(2048)")
    private String address;

    //optional
    @Column
    private Status status;

    @Column
    private Timestamp dateCreated;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id", nullable = false, columnDefinition = "BINARY(16)")
    private User client;

    @ManyToOne
    @JoinColumn(name = "delivery_man_id", columnDefinition = "BINARY(16)")
    private User deliveryMan;

    @OneToMany(mappedBy = "order", orphanRemoval = true)
    private Set<OrderProduct> orderProducts = new LinkedHashSet<>();

    public Order(UUID orderId) {
        this.id = orderId;
    }

    public Order() {
        this.id = UUID.randomUUID();
    }

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

    public void setAddress(String address) {
        this.address = address;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Timestamp getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Timestamp dateCreated) {
        this.dateCreated = dateCreated;
    }
}
