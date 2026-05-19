package com.venteapp.dto;

import com.venteapp.entity.Vente;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BusinessDTOs {

    // ===== PRODUIT =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ProduitDTO {
        private Long id;
        @NotBlank private String nom;
        private String description;
        @NotBlank private String reference;
        @NotNull @DecimalMin("0") private BigDecimal prix;
        private BigDecimal prixAchat;
        @Min(0) private Integer stock;
        private Integer stockMinimum;
        private Long categorieId;
        private String categorieNom;
        private boolean actif;
        private LocalDateTime createdAt;
        private boolean stockFaible;
    }

    // ===== CLIENT =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ClientDTO {
        private Long id;
        @NotBlank private String nom;
        @NotBlank private String prenom;
        @Email private String email;
        private String telephone;
        private String adresse;
        private String ville;
        private String codePostal;
        private String pays;
        private String numFiscal;
        private boolean actif;
        private LocalDateTime createdAt;
        private int nombreVentes;
        private BigDecimal totalAchats;
    }

    // ===== CATEGORIE =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CategorieDTO {
        private Long id;
        @NotBlank private String nom;
        private String description;
        private int nombreProduits;
    }

    // ===== VENTE =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VenteDTO {
        private Long id;
        private String numero;
        private Long clientId;
        private String clientNom;
        private String vendeurUsername;
        private Vente.StatutVente statut;
        private Vente.ModePaiement modePaiement;
        private List<LigneVenteDTO> lignes;
        private BigDecimal sousTotal;
        private BigDecimal tauxTva;
        private BigDecimal montantTva;
        private BigDecimal montantRemise;
        private BigDecimal totalTtc;
        private String notes;
        private LocalDateTime dateVente;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class LigneVenteDTO {
        private Long id;
        private Long produitId;
        private String produitNom;
        private String produitReference;
        @Min(1) private Integer quantite;
        @NotNull private BigDecimal prixUnitaire;
        private BigDecimal remise;
        private BigDecimal sousTotal;
    }

    // ===== DASHBOARD =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DashboardDTO {
        private BigDecimal chiffreAffaires;
        private BigDecimal chiffreAffairesMois;
        private long nombreVentes;
        private long nombreVentesMois;
        private long nombreClients;
        private long nombreProduits;
        private long produitStockFaible;
        private List<VenteDTO> dernieresVentes;
        private List<StatsMoisDTO> statsParMois;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class StatsMoisDTO {
        private int mois;
        private String nomMois;
        private BigDecimal total;
    }
}
