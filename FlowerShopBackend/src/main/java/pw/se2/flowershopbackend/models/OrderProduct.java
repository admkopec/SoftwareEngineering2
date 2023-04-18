package pw.se2.flowershopbackend.models;

import org.hibernate.Hibernate;
import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "client_order_product")
public class OrderProduct {
    public OrderProduct() {

    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long quantity;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false, columnDefinition = "BINARY(16)")
    private Order order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false, columnDefinition = "BINARY(16)")
    private Product product;

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

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
