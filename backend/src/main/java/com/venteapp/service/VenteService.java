package com.venteapp.service;

import com.venteapp.dto.BusinessDTOs.*;
import com.venteapp.entity.*;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VenteService {

    private final VenteRepository venteRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final UserRepository userRepository;
    private final AtomicLong counter = new AtomicLong(1000);

    public List<VenteDTO> findAll() {
        return venteRepository.findRecentes().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public VenteDTO findById(Long id) {
        return toDTO(venteRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Vente introuvable: " + id)));
    }

    @Transactional
    public VenteDTO create(VenteDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
            .orElseThrow(() -> new BusinessException("Client introuvable"));

        Vente vente = new Vente();
        vente.setNumero(genererNumero());
        vente.setClient(client);
        vente.setStatut(Vente.StatutVente.EN_ATTENTE);
        vente.setModePaiement(dto.getModePaiement());
        vente.setNotes(dto.getNotes());
        if (dto.getTauxTva() != null) vente.setTauxTva(dto.getTauxTva());
        if (dto.getMontantRemise() != null) vente.setMontantRemise(dto.getMontantRemise());

        // Set vendeur
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByUsername(username).ifPresent(vente::setVendeur);

        // Lignes
        for (LigneVenteDTO ligneDto : dto.getLignes()) {
            Produit produit = produitRepository.findById(ligneDto.getProduitId())
                .orElseThrow(() -> new BusinessException("Produit introuvable: " + ligneDto.getProduitId()));

            if (produit.getStock() < ligneDto.getQuantite()) {
                throw new BusinessException("Stock insuffisant pour: " + produit.getNom());
            }

            LigneVente ligne = LigneVente.builder()
                .vente(vente)
                .produit(produit)
                .quantite(ligneDto.getQuantite())
                .prixUnitaire(ligneDto.getPrixUnitaire() != null ? ligneDto.getPrixUnitaire() : produit.getPrix())
                .remise(ligneDto.getRemise() != null ? ligneDto.getRemise() : java.math.BigDecimal.ZERO)
                .build();

            vente.getLignes().add(ligne);

            // Décrémenter stock
            produit.setStock(produit.getStock() - ligneDto.getQuantite());
            produitRepository.save(produit);
        }

        vente.calculerTotaux();
        return toDTO(venteRepository.save(vente));
    }

    @Transactional
    public VenteDTO updateStatut(Long id, Vente.StatutVente statut) {
        Vente vente = venteRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Vente introuvable: " + id));
        vente.setStatut(statut);
        return toDTO(venteRepository.save(vente));
    }

    @Transactional
    public void annuler(Long id) {
        Vente vente = venteRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Vente introuvable: " + id));

        if (vente.getStatut() == Vente.StatutVente.ANNULEE) {
            throw new BusinessException("Vente déjà annulée");
        }

        // Remettre le stock
        vente.getLignes().forEach(ligne -> {
            Produit p = ligne.getProduit();
            p.setStock(p.getStock() + ligne.getQuantite());
            produitRepository.save(p);
        });

        vente.setStatut(Vente.StatutVente.ANNULEE);
        venteRepository.save(vente);
    }

    private String genererNumero() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        return "VTE-" + date + "-" + counter.incrementAndGet();
    }

    public VenteDTO toDTO(Vente v) {
        List<LigneVenteDTO> lignes = v.getLignes().stream()
            .map(l -> LigneVenteDTO.builder()
                .id(l.getId())
                .produitId(l.getProduit().getId())
                .produitNom(l.getProduit().getNom())
                .produitReference(l.getProduit().getReference())
                .quantite(l.getQuantite())
                .prixUnitaire(l.getPrixUnitaire())
                .remise(l.getRemise())
                .sousTotal(l.getSousTotal())
                .build())
            .collect(Collectors.toList());

        return VenteDTO.builder()
            .id(v.getId())
            .numero(v.getNumero())
            .clientId(v.getClient().getId())
            .clientNom(v.getClient().getNomComplet())
            .vendeurUsername(v.getVendeur() != null ? v.getVendeur().getUsername() : null)
            .statut(v.getStatut())
            .modePaiement(v.getModePaiement())
            .lignes(lignes)
            .sousTotal(v.getSousTotal())
            .tauxTva(v.getTauxTva())
            .montantTva(v.getMontantTva())
            .montantRemise(v.getMontantRemise())
            .totalTtc(v.getTotalTtc())
            .notes(v.getNotes())
            .dateVente(v.getDateVente())
            .build();
    }
}
