package com.venteapp.service;

import com.venteapp.dto.BusinessDTOs.*;
import com.venteapp.entity.*;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;

    public List<ProduitDTO> findAll() {
        return produitRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ProduitDTO> findActifs() {
        return produitRepository.findByActifTrue().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProduitDTO findById(Long id) {
        return toDTO(produitRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Produit introuvable: " + id)));
    }

    @Transactional
    public ProduitDTO create(ProduitDTO dto) {
        if (produitRepository.existsByReference(dto.getReference())) {
            throw new BusinessException("Référence déjà utilisée: " + dto.getReference());
        }
        Produit produit = fromDTO(dto);
        return toDTO(produitRepository.save(produit));
    }

    @Transactional
    public ProduitDTO update(Long id, ProduitDTO dto) {
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Produit introuvable: " + id));

        produit.setNom(dto.getNom());
        produit.setDescription(dto.getDescription());
        produit.setPrix(dto.getPrix());
        produit.setPrixAchat(dto.getPrixAchat());
        produit.setStock(dto.getStock());
        produit.setStockMinimum(dto.getStockMinimum());
        produit.setActif(dto.isActif());

        if (dto.getCategorieId() != null) {
            Categorie cat = categorieRepository.findById(dto.getCategorieId())
                .orElseThrow(() -> new BusinessException("Catégorie introuvable"));
            produit.setCategorie(cat);
        }

        return toDTO(produitRepository.save(produit));
    }

    @Transactional
    public void delete(Long id) {
        Produit produit = produitRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Produit introuvable: " + id));
        produit.setActif(false);
        produitRepository.save(produit);
    }

    public List<ProduitDTO> findStockFaible() {
        return produitRepository.findStockFaible().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProduitDTO toDTO(Produit p) {
        return ProduitDTO.builder()
            .id(p.getId())
            .nom(p.getNom())
            .description(p.getDescription())
            .reference(p.getReference())
            .prix(p.getPrix())
            .prixAchat(p.getPrixAchat())
            .stock(p.getStock())
            .stockMinimum(p.getStockMinimum())
            .categorieId(p.getCategorie() != null ? p.getCategorie().getId() : null)
            .categorieNom(p.getCategorie() != null ? p.getCategorie().getNom() : null)
            .actif(p.isActif())
            .createdAt(p.getCreatedAt())
            .stockFaible(p.isStockFaible())
            .build();
    }

    private Produit fromDTO(ProduitDTO dto) {
        Produit p = new Produit();
        p.setNom(dto.getNom());
        p.setDescription(dto.getDescription());
        p.setReference(dto.getReference());
        p.setPrix(dto.getPrix());
        p.setPrixAchat(dto.getPrixAchat());
        p.setStock(dto.getStock() != null ? dto.getStock() : 0);
        p.setStockMinimum(dto.getStockMinimum() != null ? dto.getStockMinimum() : 5);
        p.setActif(true);
        if (dto.getCategorieId() != null) {
            categorieRepository.findById(dto.getCategorieId()).ifPresent(p::setCategorie);
        }
        return p;
    }
}
