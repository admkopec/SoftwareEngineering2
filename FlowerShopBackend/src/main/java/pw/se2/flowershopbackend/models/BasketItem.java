package pw.se2.flowershopbackend.models;

import javax.persistence.*;
import javax.validation.constraints.Positive;

@Entity
@Table(name = "basket", uniqueConstraints = { @UniqueConstraint(columnNames =
        { "client_id", "product_id" }) })
public class BasketItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "client_id", nullable = false, columnDefinition = "BINARY(16)")
    private User client;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false, columnDefinition = "BINARY(16)")
    private Product product;

    @Column(nullable = false)
    @Positive
    private int quantity;

    public BasketItem() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

}
