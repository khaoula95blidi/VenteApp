package com.venteapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ventes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String numero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendeur_id")
    private User vendeur;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutVente statut = StatutVente.EN_ATTENTE;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode_paiement")
    private ModePaiement modePaiement;

    @OneToMany(mappedBy = "vente", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LigneVente> lignes = new ArrayList<>();

    @Column(name = "sous_total", precision = 12, scale = 2)
    private BigDecimal sousTotal = BigDecimal.ZERO;

    @Column(name = "taux_tva", precision = 5, scale = 2)
    private BigDecimal tauxTva = new BigDecimal("19.00");

    @Column(name = "montant_tva", precision = 12, scale = 2)
    private BigDecimal montantTva = BigDecimal.ZERO;

    @Column(name = "montant_remise", precision = 12, scale = 2)
    private BigDecimal montantRemise = BigDecimal.ZERO;

    @Column(name = "total_ttc", precision = 12, scale = 2)
    private BigDecimal totalTtc = BigDecimal.ZERO;

    @Column(length = 500)
    private String notes;

    @Column(name = "date_vente")
    private LocalDateTime dateVente;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        dateVente = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void calculerTotaux() {
        sousTotal = lignes.stream()
            .map(LigneVente::getSousTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        montantTva = sousTotal.multiply(tauxTva).divide(new BigDecimal("100"));
        totalTtc = sousTotal.add(montantTva).subtract(montantRemise);
    }

    public enum StatutVente {
        EN_ATTENTE, CONFIRMEE, PAYEE, LIVREE, ANNULEE
    }

    public enum ModePaiement {
        ESPECES, CHEQUE, VIREMENT, CARTE, AUTRE
    }
}
