package com.venteapp.config;

import com.venteapp.entity.*;
import com.venteapp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategorieRepository categorieRepository;
    private final ProduitRepository produitRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        log.info("🚀 Initializing Marketplace Data...");

        // ===== USERS =====
        // Admin
        User admin = User.builder()
            .username("admin").email("admin@marketplace.com")
            .password(passwordEncoder.encode("Admin123!"))
            .fullName("Administrateur Système")
            .role(User.Role.ROLE_ADMIN).enabled(true).build();

        // Vendor 1 - Approved
        User vendor1 = User.builder()
            .username("vendor1").email("vendor1@marketplace.com")
            .password(passwordEncoder.encode("Vendor123!"))
            .fullName("Mohamed Boutique")
            .companyName("TechStore")
            .role(User.Role.ROLE_VENDOR).enabled(true)
            .vendorStatus(User.VendorStatus.APPROVED)
            .registeredAt(LocalDateTime.now()).build();

        // Vendor 2 - Pending
        User vendor2 = User.builder()
            .username("vendor2").email("vendor2@marketplace.com")
            .password(passwordEncoder.encode("Vendor123!"))
            .fullName("Sana ElectroShop")
            .companyName("ElectroShop")
            .role(User.Role.ROLE_VENDOR).enabled(true)
            .vendorStatus(User.VendorStatus.PENDING)
            .registeredAt(LocalDateTime.now()).build();

        // Client 1
        User client1 = User.builder()
            .username("client1").email("client1@marketplace.com")
            .password(passwordEncoder.encode("Client123!"))
            .fullName("Ali Customer")
            .role(User.Role.ROLE_CLIENT).enabled(true).build();

        // Client 2
        User client2 = User.builder()
            .username("client2").email("client2@marketplace.com")
            .password(passwordEncoder.encode("Client123!"))
            .fullName("Fatma Buyer")
            .role(User.Role.ROLE_CLIENT).enabled(true).build();

        userRepository.saveAll(Arrays.asList(admin, vendor1, vendor2, client1, client2));

        // ===== CATEGORIES =====
        Categorie electronique = Categorie.builder()
            .nom("Électronique").description("Appareils électroniques").build();
        Categorie informatique = Categorie.builder()
            .nom("Informatique").description("Matériel informatique").build();
        Categorie bureau = Categorie.builder()
            .nom("Bureau").description("Fournitures de bureau").build();
        Categorie mobilier = Categorie.builder()
            .nom("Mobilier").description("Mobilier de bureau").build();

        categorieRepository.saveAll(Arrays.asList(electronique, informatique, bureau, mobilier));

        // ===== PRODUCTS FOR VENDOR 1 (APPROVED) =====
        List<Produit> vendor1Products = Arrays.asList(
            Produit.builder().nom("Ordinateur Portable Dell XPS 15").reference("DELL-XPS-15")
                .prix(new BigDecimal("2499.99")).prixAchat(new BigDecimal("1800.00"))
                .stock(12).stockMinimum(3).categorie(informatique).vendor(vendor1).actif(true).build(),
            Produit.builder().nom("iPhone 15 Pro 256GB").reference("APPLE-IP15P-256")
                .prix(new BigDecimal("1599.00")).prixAchat(new BigDecimal("1100.00"))
                .stock(8).stockMinimum(5).categorie(electronique).vendor(vendor1).actif(true).build(),
            Produit.builder().nom("Écran Samsung 27\" 4K").reference("SAM-MON27-4K")
                .prix(new BigDecimal("649.99")).prixAchat(new BigDecimal("400.00"))
                .stock(25).stockMinimum(5).categorie(informatique).vendor(vendor1).actif(true).build(),
            Produit.builder().nom("Clavier Mécanique Logitech").reference("LOG-KB-MX")
                .prix(new BigDecimal("159.99")).prixAchat(new BigDecimal("90.00"))
                .stock(3).stockMinimum(5).categorie(informatique).vendor(vendor1).actif(true).build(),
            Produit.builder().nom("Casque Sony WH-1000XM5").reference("SONY-WH-XM5")
                .prix(new BigDecimal("379.00")).prixAchat(new BigDecimal("220.00"))
                .stock(15).stockMinimum(5).categorie(electronique).vendor(vendor1).actif(true).build(),
            Produit.builder().nom("Tablette iPad Air 5e Génération").reference("APPLE-IPAD-AIR5")
                .prix(new BigDecimal("849.00")).prixAchat(new BigDecimal("600.00"))
                .stock(10).stockMinimum(3).categorie(electronique).vendor(vendor1).actif(true).build()
        );
        produitRepository.saveAll(vendor1Products);

        // ===== PRODUCTS FOR VENDOR 2 (PENDING) =====
        List<Produit> vendor2Products = Arrays.asList(
            Produit.builder().nom("Chaise de Bureau Ergonomique").reference("CHAIR-ERG-01")
                .prix(new BigDecimal("799.00")).prixAchat(new BigDecimal("450.00"))
                .stock(7).stockMinimum(2).categorie(mobilier).vendor(vendor2).actif(true).build(),
            Produit.builder().nom("Imprimante HP LaserJet Pro").reference("HP-LJ-PRO")
                .prix(new BigDecimal("449.00")).prixAchat(new BigDecimal("280.00"))
                .stock(2).stockMinimum(3).categorie(informatique).vendor(vendor2).actif(true).build()
        );
        produitRepository.saveAll(vendor2Products);

        log.info("✅ Marketplace Data Initialized Successfully!");
        log.info("   📦 Admin: admin / Admin123!");
        log.info("   🏪 Vendor 1 (APPROVED): vendor1 / Vendor123! (TechStore)");
        log.info("   🏪 Vendor 2 (PENDING): vendor2 / Vendor123! (ElectroShop)");
        log.info("   👤 Client 1: client1 / Client123!");
        log.info("   👤 Client 2: client2 / Client123!");
        log.info("   📂 Categories: 4 (Électronique, Informatique, Bureau, Mobilier)");
        log.info("   📦 Products: 8 total (6 from Vendor1, 2 from Vendor2)");
    }
}
