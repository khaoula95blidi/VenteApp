package com.venteapp.controller;

import com.venteapp.dto.BusinessDTOs.CategorieDTO;
import com.venteapp.entity.Categorie;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.CategorieRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategorieController {

    private final CategorieRepository repo;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public List<CategorieDTO> getAll() {
        return repo.findAll().stream().map(c -> CategorieDTO.builder()
            .id(c.getId()).nom(c.getNom()).description(c.getDescription())
            .nombreProduits(c.getProduits() != null ? c.getProduits().size() : 0)
            .build()).collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategorieDTO> create(@Valid @RequestBody CategorieDTO dto) {
        if (repo.existsByNom(dto.getNom()))
            throw new BusinessException("Catégorie déjà existante : " + dto.getNom());
        Categorie c = Categorie.builder().nom(dto.getNom()).description(dto.getDescription()).build();
        Categorie saved = repo.save(c);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            CategorieDTO.builder().id(saved.getId()).nom(saved.getNom()).description(saved.getDescription()).build()
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CategorieDTO update(@PathVariable Long id, @Valid @RequestBody CategorieDTO dto) {
        Categorie c = repo.findById(id).orElseThrow(() -> new BusinessException("Catégorie introuvable"));
        c.setNom(dto.getNom());
        c.setDescription(dto.getDescription());
        repo.save(c);
        return dto;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
