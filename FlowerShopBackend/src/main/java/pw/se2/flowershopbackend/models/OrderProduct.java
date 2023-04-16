package pw.se2.flowershopbackend.models;

import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table
public class OrderProduct {

    @Id
    @GeneratedValue
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    @Column(nullable = false)
    private Long quantity;

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false, columnDefinition = "BINARY(16) DEFAULT (UUID_TO_BIN(UUID()))")
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false, columnDefinition = "BINARY(16) DEFAULT (UUID_TO_BIN(UUID()))")
    private Order order;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OrderProduct that = (OrderProduct) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
