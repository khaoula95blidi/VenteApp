package com.venteapp.controller;

import com.venteapp.dto.BusinessDTOs;
import com.venteapp.entity.Produit;
import com.venteapp.entity.User;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;

    // ===== VENDOR BROWSING =====

    @GetMapping("/vendors")
    public ResponseEntity<List<BusinessDTOs.VendorProfileDTO>> browseVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> approvedVendors = userRepository.findByRoleAndVendorStatus(
            User.Role.ROLE_VENDOR, User.VendorStatus.APPROVED, pageable);

        List<BusinessDTOs.VendorProfileDTO> dtos = approvedVendors.getContent().stream()
            .map(v -> BusinessDTOs.VendorProfileDTO.builder()
                .id(v.getId())
                .username(v.getUsername())
                .email(v.getEmail())
                .fullName(v.getFullName())
                .companyName(v.getCompanyName())
                .vendorStatus(v.getVendorStatus().name())
                .registeredAt(v.getRegisteredAt())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/vendors/{vendorId}")
    public ResponseEntity<BusinessDTOs.VendorProfileDTO> getVendorProfile(@PathVariable Long vendorId) {
        User vendor = userRepository.findById(vendorId)
            .orElseThrow(() -> new BusinessException("Vendeur introuvable"));

        if (vendor.getRole() != User.Role.ROLE_VENDOR || vendor.getVendorStatus() != User.VendorStatus.APPROVED) {
            throw new BusinessException("Vendeur introuvable ou non approuvé");
        }

        return ResponseEntity.ok(BusinessDTOs.VendorProfileDTO.builder()
            .id(vendor.getId())
            .username(vendor.getUsername())
            .email(vendor.getEmail())
            .fullName(vendor.getFullName())
            .companyName(vendor.getCompanyName())
            .vendorStatus(vendor.getVendorStatus().name())
            .registeredAt(vendor.getRegisteredAt())
            .build());
    }

    @GetMapping("/vendors/{vendorId}/products")
    public ResponseEntity<List<BusinessDTOs.ProduitDTO>> getVendorProducts(
            @PathVariable Long vendorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User vendor = userRepository.findById(vendorId)
            .orElseThrow(() -> new BusinessException("Vendeur introuvable"));

        if (vendor.getRole() != User.Role.ROLE_VENDOR || vendor.getVendorStatus() != User.VendorStatus.APPROVED) {
            throw new BusinessException("Vendeur introuvable ou non approuvé");
        }

        Pageable pageable = PageRequest.of(page, size);
        List<Produit> products = produitRepository.findByVendorIdAndActifTrue(vendorId);

        List<BusinessDTOs.ProduitDTO> dtos = products.stream()
            .map(p -> BusinessDTOs.ProduitDTO.builder()
                .id(p.getId())
                .nom(p.getNom())
                .description(p.getDescription())
                .reference(p.getReference())
                .prix(p.getPrix())
                .stock(p.getStock())
                .categorieId(p.getCategorie() != null ? p.getCategorie().getId() : null)
                .categorieNom(p.getCategorie() != null ? p.getCategorie().getNom() : null)
                .actif(p.isActif())
                .createdAt(p.getCreatedAt())
                .stockFaible(p.getStock() <= p.getStockMinimum())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/vendors/{vendorId}/products/{productId}")
    public ResponseEntity<BusinessDTOs.ProduitDTO> getVendorProduct(
            @PathVariable Long vendorId,
            @PathVariable Long productId) {
        User vendor = userRepository.findById(vendorId)
            .orElseThrow(() -> new BusinessException("Vendeur introuvable"));

        if (vendor.getRole() != User.Role.ROLE_VENDOR || vendor.getVendorStatus() != User.VendorStatus.APPROVED) {
            throw new BusinessException("Vendeur introuvable ou non approuvé");
        }

        Produit product = produitRepository.findById(productId)
            .orElseThrow(() -> new BusinessException("Produit introuvable"));

        if (!product.getVendor().getId().equals(vendorId) || !product.isActif()) {
            throw new BusinessException("Produit introuvable ou non disponible");
        }

        return ResponseEntity.ok(BusinessDTOs.ProduitDTO.builder()
            .id(product.getId())
            .nom(product.getNom())
            .description(product.getDescription())
            .reference(product.getReference())
            .prix(product.getPrix())
            .stock(product.getStock())
            .stockMinimum(product.getStockMinimum())
            .categorieId(product.getCategorie() != null ? product.getCategorie().getId() : null)
            .categorieNom(product.getCategorie() != null ? product.getCategorie().getNom() : null)
            .actif(product.isActif())
            .createdAt(product.getCreatedAt())
            .stockFaible(product.getStock() <= product.getStockMinimum())
            .build());
    }

    // ===== PRODUCT BROWSING =====

    @GetMapping("/products")
    public ResponseEntity<List<BusinessDTOs.ProduitDTO>> browseProducts(
            @RequestParam(required = false) Long categorieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Produit> products;

        if (categorieId != null) {
            products = produitRepository.findByCategorieId(categorieId);
        } else {
            products = produitRepository.findByActifTrue();
        }

        List<BusinessDTOs.ProduitDTO> dtos = products.stream()
            .filter(p -> p.getVendor() != null && p.getVendor().getVendorStatus() == User.VendorStatus.APPROVED)
            .map(p -> BusinessDTOs.ProduitDTO.builder()
                .id(p.getId())
                .nom(p.getNom())
                .description(p.getDescription())
                .reference(p.getReference())
                .prix(p.getPrix())
                .stock(p.getStock())
                .categorieId(p.getCategorie() != null ? p.getCategorie().getId() : null)
                .categorieNom(p.getCategorie() != null ? p.getCategorie().getNom() : null)
                .actif(p.isActif())
                .createdAt(p.getCreatedAt())
                .stockFaible(p.getStock() <= p.getStockMinimum())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<BusinessDTOs.ProduitDTO> getProduct(@PathVariable Long productId) {
        Produit product = produitRepository.findById(productId)
            .orElseThrow(() -> new BusinessException("Produit introuvable"));

        if (!product.isActif() || product.getVendor() == null || product.getVendor().getVendorStatus() != User.VendorStatus.APPROVED) {
            throw new BusinessException("Produit introuvable ou non disponible");
        }

        return ResponseEntity.ok(BusinessDTOs.ProduitDTO.builder()
            .id(product.getId())
            .nom(product.getNom())
            .description(product.getDescription())
            .reference(product.getReference())
            .prix(product.getPrix())
            .stock(product.getStock())
            .stockMinimum(product.getStockMinimum())
            .categorieId(product.getCategorie() != null ? product.getCategorie().getId() : null)
            .categorieNom(product.getCategorie() != null ? product.getCategorie().getNom() : null)
            .actif(product.isActif())
            .createdAt(product.getCreatedAt())
            .stockFaible(product.getStock() <= product.getStockMinimum())
            .build());
    }

    // ===== CATEGORIES =====

    @GetMapping("/categories")
    public ResponseEntity<List<BusinessDTOs.CategorieDTO>> getCategories() {
        List<BusinessDTOs.CategorieDTO> categories = categorieRepository.findAll().stream()
            .map(c -> BusinessDTOs.CategorieDTO.builder()
                .id(c.getId())
                .nom(c.getNom())
                .description(c.getDescription())
                .nombreProduits((int) produitRepository.countByCategorieId(c.getId()))
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(categories);
    }
}
