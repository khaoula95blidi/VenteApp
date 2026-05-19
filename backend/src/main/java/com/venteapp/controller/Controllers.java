package com.venteapp.controller;

import com.venteapp.dto.AuthDTOs.*;
import com.venteapp.dto.BusinessDTOs.*;
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
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest req) {
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
    public ResponseEntity<List<ProduitDTO>> getAll() {
        return ResponseEntity.ok(produitService.findAll());
    }

    @GetMapping("/actifs")
    public ResponseEntity<List<ProduitDTO>> getActifs() {
        return ResponseEntity.ok(produitService.findActifs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(produitService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProduitDTO> create(@Valid @RequestBody ProduitDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produitService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProduitDTO> update(@PathVariable Long id, @Valid @RequestBody ProduitDTO dto) {
        return ResponseEntity.ok(produitService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stock-faible")
    public ResponseEntity<List<ProduitDTO>> stockFaible() {
        return ResponseEntity.ok(produitService.findStockFaible());
    }
}

// ===== CLIENT CONTROLLER =====
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
class ClientController {
    private final ClientService clientService;

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAll() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClientDTO>> search(@RequestParam String q) {
        return ResponseEntity.ok(clientService.search(q));
    }

    @PostMapping
    public ResponseEntity<ClientDTO> create(@Valid @RequestBody ClientDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientDTO> update(@PathVariable Long id, @Valid @RequestBody ClientDTO dto) {
        return ResponseEntity.ok(clientService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

// ===== VENTE CONTROLLER =====
@RestController
@RequestMapping("/api/ventes")
@RequiredArgsConstructor
class VenteController {
    private final VenteService venteService;

    @GetMapping
    public ResponseEntity<List<VenteDTO>> getAll() {
        return ResponseEntity.ok(venteService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenteDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(venteService.findById(id));
    }

    @PostMapping
    public ResponseEntity<VenteDTO> create(@Valid @RequestBody VenteDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(venteService.create(dto));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<VenteDTO> updateStatut(@PathVariable Long id,
                                                  @RequestParam Vente.StatutVente statut) {
        return ResponseEntity.ok(venteService.updateStatut(id, statut));
    }

    @DeleteMapping("/{id}")
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
    public ResponseEntity<DashboardDTO> getDashboard() {
        return ResponseEntity.ok(dashboardService.getDashboard());
    }
}
