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
        private BigDecimal prixAchat = BigDecimal.ZERO;
        @Min(0) private Integer stock = 0;
        private Integer stockMinimum = 5;
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

    // ===== ORDER (MARKETPLACE) =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderDTO {
        private Long id;
        private String orderNumber;
        private Long clientId;
        private String clientNom;
        private Long vendorId;
        private String vendorCompanyName;
        private LocalDateTime orderDate;
        private String status;
        private List<OrderItemDTO> items;
        private BigDecimal subtotal;
        private BigDecimal taxAmount;
        private BigDecimal discountAmount;
        private BigDecimal totalAmount;
        private String shippingAddress;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class OrderItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String productReference;
        @Min(1) private Integer quantity;
        @NotNull @DecimalMin("0") private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }

    // ===== NOTIFICATION =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class NotificationDTO {
        private Long id;
        private Long vendorId;
        private String type;
        private String title;
        private String message;
        private Long productId;
        private String productName;
        private Long orderId;
        private String orderNumber;
        private Boolean isRead;
        private LocalDateTime createdAt;
    }

    // ===== VENDOR =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VendorDTO {
        private Long id;
        private String username;
        @Email private String email;
        private String fullName;
        @NotBlank private String companyName;
        private String vendorStatus;
        private String rejectionReason;
        private LocalDateTime registeredAt;
        private int totalProducts;
        private long totalOrders;
        private BigDecimal totalRevenue;
    }

    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VendorProfileDTO {
        private Long id;
        private String username;
        @Email private String email;
        private String fullName;
        private String companyName;
        private String vendorStatus;
        private LocalDateTime registeredAt;
    }

    // ===== ADMIN DASHBOARD =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class AdminDashboardDTO {
        private long totalVendors;
        private long approvedVendors;
        private long pendingVendors;
        private long totalClients;
        private long totalProducts;
        private long totalCategories;
        private long totalOrders;
        private BigDecimal totalRevenue;
    }

    // ===== VENDOR DASHBOARD =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class VendorDashboardDTO {
        private Long vendorId;
        private String vendorName;
        private long totalProducts;
        private long lowStockProducts;
        private long totalOrders;
        private BigDecimal totalRevenue;
    }

    // ===== CLIENT PROFILE =====
    @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ClientProfileDTO {
        private Long id;
        private String username;
        @Email private String email;
        private String fullName;
        private LocalDateTime registeredAt;
    }

    @Getter @Setter
    public static class ClientProfileUpdateDTO {
        @Email private String email;
        private String fullName;
    }
}
