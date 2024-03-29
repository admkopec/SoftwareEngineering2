package pw.se2.flowershopbackend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.*;
import java.util.Set;
import java.util.UUID;

@Entity
@Table
public class Product {
    public enum Category
    {
        @JsonProperty("flower")
        Flower,
        @JsonProperty("bouquet")
        Bouquet,
        @JsonProperty("groundFlower")
        GroundFlower,
        @JsonProperty("supplement")
        Supplement
    }

    @Id
    @Column(columnDefinition = "BINARY(16) DEFAULT (UUID_TO_BIN(UUID()))")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "VARCHAR(2048)")
    private String description;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private Category category;

    @Lob
    @Column(columnDefinition = "MEDIUMBLOB")
    private byte[] image;

    @OneToMany(mappedBy = "product", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private Set<BasketItem> basketItemSet;

    public Product(UUID productId) {
        this.id = productId;
    }

    public Product() {
        this.id = UUID.randomUUID();
    }

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

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }

    public void setPrice(double price) { this.price = price; }

    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Category getCategory() { return category; }

    public void setCategory(Category category) { this.category = category; }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }
}
