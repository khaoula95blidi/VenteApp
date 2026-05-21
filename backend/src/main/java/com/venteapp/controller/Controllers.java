package com.venteapp.controller;

import com.venteapp.dto.AuthDTOs;
import com.venteapp.dto.BusinessDTOs;
import com.venteapp.entity.Vente;
import com.venteapp.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// ===== AUTH CONTROLLER =====
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthDTOs.AuthResponse> login(@Valid @RequestBody AuthDTOs.LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthDTOs.AuthResponse> register(@Valid @RequestBody AuthDTOs.RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    @PostMapping("/register-vendor")
    public ResponseEntity<AuthDTOs.AuthResponse> registerVendor(@Valid @RequestBody AuthDTOs.VendorRegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerVendor(req));
    }

    @PostMapping("/register-client")
    public ResponseEntity<AuthDTOs.AuthResponse> registerClient(@Valid @RequestBody AuthDTOs.ClientRegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerClient(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthDTOs.AuthResponse> refresh(@Valid @RequestBody AuthDTOs.RefreshRequest req) {
        return ResponseEntity.ok(authService.refresh(req));
    }
}

// ===== PRODUIT CONTROLLER =====
@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
class ProduitController {
    private final ProduitService produitService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public ResponseEntity<List<BusinessDTOs.ProduitDTO>> getAll() {
        return ResponseEntity.ok(produitService.findAll());
    }

    @GetMapping("/actifs")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public ResponseEntity<List<BusinessDTOs.ProduitDTO>> getActifs() {
        return ResponseEntity.ok(produitService.findActifs());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public ResponseEntity<BusinessDTOs.ProduitDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusinessDTOs.ProduitDTO> create(@Valid @RequestBody BusinessDTOs.ProduitDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produitService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BusinessDTOs.ProduitDTO> update(@PathVariable Long id, @Valid @RequestBody BusinessDTOs.ProduitDTO dto) {
        return ResponseEntity.ok(produitService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stock-faible")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public ResponseEntity<List<BusinessDTOs.ProduitDTO>> stockFaible() {
        return ResponseEntity.ok(produitService.findStockFaible());
    }
}

// ===== VENTE CONTROLLER =====
@RestController
@RequestMapping("/api/ventes")
@RequiredArgsConstructor
class VenteController {
    private final VenteService venteService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public ResponseEntity<List<BusinessDTOs.VenteDTO>> getAll() {
        return ResponseEntity.ok(venteService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public ResponseEntity<BusinessDTOs.VenteDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(venteService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public ResponseEntity<BusinessDTOs.VenteDTO> create(@Valid @RequestBody BusinessDTOs.VenteDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(venteService.create(dto));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<BusinessDTOs.VenteDTO> updateStatut(@PathVariable Long id,
                                                  @RequestParam Vente.StatutVente statut) {
        return ResponseEntity.ok(venteService.updateStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<Void> annuler(@PathVariable Long id) {
        venteService.annuler(id);
        return ResponseEntity.noContent().build();
    }
}

// ===== DASHBOARD CONTROLLER =====
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'VENDEUR')")
    public ResponseEntity<BusinessDTOs.DashboardDTO> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboard());
    }
}
