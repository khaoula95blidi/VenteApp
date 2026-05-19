package com.venteapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "produits")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Produit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    @NotBlank
    private String nom;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, unique = true, length = 50)
    private String reference;

    @Column(nullable = false, precision = 10, scale = 2)
    @DecimalMin("0.0")
    private BigDecimal prix;

    @Column(name = "prix_achat", precision = 10, scale = 2)
    private BigDecimal prixAchat;

    @Column(nullable = false)
    @Min(0)
    private Integer stock = 0;

    @Column(name = "stock_minimum")
    private Integer stockMinimum = 5;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @Column(nullable = false)
    private boolean actif = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isStockFaible() {
        return stock <= stockMinimum;
    }
}
