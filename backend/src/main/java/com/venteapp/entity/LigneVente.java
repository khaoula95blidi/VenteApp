package com.venteapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "lignes_vente")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LigneVente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vente_id", nullable = false)
    private Vente vente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @Column(nullable = false)
    private Integer quantite;

    @Column(name = "prix_unitaire", nullable = false, precision = 10, scale = 2)
    private BigDecimal prixUnitaire;

    @Column(precision = 5, scale = 2)
    private BigDecimal remise = BigDecimal.ZERO;

    @Column(name = "sous_total", precision = 12, scale = 2)
    private BigDecimal sousTotal;

    @PrePersist
    @PreUpdate
    protected void calculer() {
        BigDecimal base = prixUnitaire.multiply(new BigDecimal(quantite));
        BigDecimal montantRemise = base.multiply(remise).divide(new BigDecimal("100"));
        sousTotal = base.subtract(montantRemise);
    }
}
