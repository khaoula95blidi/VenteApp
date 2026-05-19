package com.venteapp.config;

import com.venteapp.entity.*;
import com.venteapp.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategorieRepository categorieRepository;
    private final ProduitRepository produitRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        log.info("Initialisation des données...");

        // Users
        User admin = User.builder()
            .username("admin").email("admin@venteapp.com")
            .password(passwordEncoder.encode("Admin123!"))
            .fullName("Administrateur Système")
            .role(User.Role.ROLE_ADMIN).enabled(true).build();

        User manager = User.builder()
            .username("manager").email("manager@venteapp.com")
            .password(passwordEncoder.encode("Manager123!"))
            .fullName("Chef des Ventes")
            .role(User.Role.ROLE_MANAGER).enabled(true).build();

        User vendeur = User.builder()
            .username("vendeur").email("vendeur@venteapp.com")
            .password(passwordEncoder.encode("Vendeur123!"))
            .fullName("Ahmed Ben Salah")
            .role(User.Role.ROLE_VENDEUR).enabled(true).build();

        userRepository.saveAll(Arrays.asList(admin, manager, vendeur));

        // Catégories
        Categorie electronique = Categorie.builder().nom("Électronique").description("Appareils électroniques").build();
        Categorie informatique = Categorie.builder().nom("Informatique").description("Matériel informatique").build();
        Categorie bureau = Categorie.builder().nom("Bureau").description("Fournitures de bureau").build();
        Categorie mobilier = Categorie.builder().nom("Mobilier").description("Mobilier de bureau").build();

        categorieRepository.saveAll(Arrays.asList(electronique, informatique, bureau, mobilier));

        // Produits
        List<Produit> produits = Arrays.asList(
            Produit.builder().nom("Ordinateur Portable Dell XPS 15").reference("DELL-XPS-15")
                .prix(new BigDecimal("2499.99")).prixAchat(new BigDecimal("1800.00"))
                .stock(12).stockMinimum(3).categorie(informatique).actif(true).build(),
            Produit.builder().nom("iPhone 15 Pro 256GB").reference("APPLE-IP15P-256")
                .prix(new BigDecimal("1599.00")).prixAchat(new BigDecimal("1100.00"))
                .stock(8).stockMinimum(5).categorie(electronique).actif(true).build(),
            Produit.builder().nom("Écran Samsung 27\" 4K").reference("SAM-MON27-4K")
                .prix(new BigDecimal("649.99")).prixAchat(new BigDecimal("400.00"))
                .stock(25).stockMinimum(5).categorie(informatique).actif(true).build(),
            Produit.builder().nom("Clavier Mécanique Logitech").reference("LOG-KB-MX")
                .prix(new BigDecimal("159.99")).prixAchat(new BigDecimal("90.00"))
                .stock(3).stockMinimum(5).categorie(informatique).actif(true).build(),
            Produit.builder().nom("Chaise de Bureau Ergonomique").reference("CHAIR-ERG-01")
                .prix(new BigDecimal("799.00")).prixAchat(new BigDecimal("450.00"))
                .stock(7).stockMinimum(2).categorie(mobilier).actif(true).build(),
            Produit.builder().nom("Imprimante HP LaserJet Pro").reference("HP-LJ-PRO")
                .prix(new BigDecimal("449.00")).prixAchat(new BigDecimal("280.00"))
                .stock(2).stockMinimum(3).categorie(informatique).actif(true).build(),
            Produit.builder().nom("Casque Sony WH-1000XM5").reference("SONY-WH-XM5")
                .prix(new BigDecimal("379.00")).prixAchat(new BigDecimal("220.00"))
                .stock(15).stockMinimum(5).categorie(electronique).actif(true).build(),
            Produit.builder().nom("Tablette iPad Air 5e Génération").reference("APPLE-IPAD-AIR5")
                .prix(new BigDecimal("849.00")).prixAchat(new BigDecimal("600.00"))
                .stock(10).stockMinimum(3).categorie(electronique).actif(true).build()
        );
        produitRepository.saveAll(produits);

        // Clients
        List<Client> clients = Arrays.asList(
            Client.builder().nom("Trabelsi").prenom("Mohamed").email("m.trabelsi@email.com")
                .telephone("+216 22 123 456").ville("Tunis").pays("Tunisie").actif(true).build(),
            Client.builder().nom("Belhassen").prenom("Sana").email("s.belhassen@corp.tn")
                .telephone("+216 55 987 654").ville("Sfax").pays("Tunisie").actif(true).build(),
            Client.builder().nom("Chaabane").prenom("Karim").email("k.chaabane@business.com")
                .telephone("+216 98 456 789").ville("Sousse").pays("Tunisie").actif(true).build(),
            Client.builder().nom("Mansouri").prenom("Leila").email("l.mansouri@gmail.com")
                .telephone("+216 27 321 654").ville("Bizerte").pays("Tunisie").actif(true).build(),
            Client.builder().nom("Hammami").prenom("Yassine").email("y.hammami@tech.tn")
                .telephone("+216 50 741 852").ville("Tunis").pays("Tunisie").actif(true).build()
        );
        clientRepository.saveAll(clients);

        log.info("✅ Données initialisées avec succès!");
        log.info("   Admin: admin / Admin123!");
        log.info("   Manager: manager / Manager123!");
        log.info("   Vendeur: vendeur / Vendeur123!");
    }
}
