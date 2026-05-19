package com.venteapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "clients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank
    private String nom;

    @Column(nullable = false, length = 100)
    @NotBlank
    private String prenom;

    @Column(unique = true, length = 150)
    @Email
    private String email;

    @Column(length = 20)
    private String telephone;

    @Column(length = 300)
    private String adresse;

    @Column(length = 100)
    private String ville;

    @Column(name = "code_postal", length = 10)
    private String codePostal;

    @Column(length = 100)
    private String pays;

    @Column(name = "num_fiscal", unique = true, length = 50)
    private String numFiscal;

    @Column(nullable = false)
    private boolean actif = true;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Vente> ventes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public String getNomComplet() {
        return prenom + " " + nom;
    }
}
