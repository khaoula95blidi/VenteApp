package com.venteapp.controller;

import com.venteapp.dto.BusinessDTOs;
import com.venteapp.entity.*;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CategorieRepository categorieRepository;
    private final NotificationRepository notificationRepository;
    private final ProduitRepository produitRepository;
    private final OrderRepository orderRepository;

    // ===== VENDOR MANAGEMENT =====

    @GetMapping("/vendors")
    public ResponseEntity<List<BusinessDTOs.VendorDTO>> getVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> vendors = userRepository.findByRole(User.Role.ROLE_VENDOR, pageable);

        List<BusinessDTOs.VendorDTO> dtos = vendors.getContent().stream()
            .map(this::mapToVendorDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/vendors/pending")
    public ResponseEntity<List<BusinessDTOs.VendorDTO>> getPendingVendors() {
        List<User> pendingVendors = userRepository.findByRoleAndVendorStatus(
            User.Role.ROLE_VENDOR, User.VendorStatus.PENDING);

        List<BusinessDTOs.VendorDTO> dtos = pendingVendors.stream()
            .map(this::mapToVendorDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/vendors/{vendorId}")
    public ResponseEntity<BusinessDTOs.VendorDTO> getVendor(@PathVariable Long vendorId) {
        User vendor = userRepository.findById(vendorId)
            .orElseThrow(() -> new BusinessException("Vendeur introuvable"));

        if (vendor.getRole() != User.Role.ROLE_VENDOR) {
            throw new BusinessException("Cet utilisateur n'est pas un vendeur");
        }

        return ResponseEntity.ok(mapToVendorDTO(vendor));
    }

    @PatchMapping("/vendors/{vendorId}/approve")
    public ResponseEntity<BusinessDTOs.VendorDTO> approveVendor(@PathVariable Long vendorId) {
        User vendor = userRepository.findById(vendorId)
            .orElseThrow(() -> new BusinessException("Vendeur introuvable"));

        if (vendor.getRole() != User.Role.ROLE_VENDOR) {
            throw new BusinessException("Cet utilisateur n'est pas un vendeur");
        }

        vendor.setVendorStatus(User.VendorStatus.APPROVED);
        vendor.setRejectionReason(null);
        userRepository.save(vendor);

        Notification notification = Notification.builder()
            .vendor(vendor)
            .type(Notification.NotificationType.VENDOR_APPROVED)
            .title("Votre compte a été approuvé")
            .message("Félicitations! Votre compte vendeur a été approuvé par l'administrateur. Vous pouvez maintenant créer et gérer vos produits.")
            .isRead(false)
            .build();
        notificationRepository.save(notification);

        return ResponseEntity.ok(mapToVendorDTO(vendor));
    }

    @PatchMapping("/vendors/{vendorId}/reject")
    public ResponseEntity<BusinessDTOs.VendorDTO> rejectVendor(
            @PathVariable Long vendorId,
            @RequestParam String reason) {
        User vendor = userRepository.findById(vendorId)
            .orElseThrow(() -> new BusinessException("Vendeur introuvable"));

        if (vendor.getRole() != User.Role.ROLE_VENDOR) {
            throw new BusinessException("Cet utilisateur n'est pas un vendeur");
        }

        vendor.setVendorStatus(User.VendorStatus.REJECTED);
        vendor.setRejectionReason(reason);
        userRepository.save(vendor);

        Notification notification = Notification.builder()
            .vendor(vendor)
            .type(Notification.NotificationType.VENDOR_REJECTED)
            .title("Votre compte a été rejeté")
            .message("Votre demande d'enregistrement a été rejetée. Raison: " + reason)
            .isRead(false)
            .build();
        notificationRepository.save(notification);

        return ResponseEntity.ok(mapToVendorDTO(vendor));
    }

    // ===== CATEGORY MANAGEMENT =====

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

    @PostMapping("/categories")
    public ResponseEntity<BusinessDTOs.CategorieDTO> createCategory(@Valid @RequestBody BusinessDTOs.CategorieDTO dto) {
        if (categorieRepository.existsByNom(dto.getNom())) {
            throw new BusinessException("Catégorie déjà existante: " + dto.getNom());
        }

        Categorie categorie = Categorie.builder()
            .nom(dto.getNom())
            .description(dto.getDescription())
            .build();

        Categorie saved = categorieRepository.save(categorie);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(BusinessDTOs.CategorieDTO.builder()
                .id(saved.getId())
                .nom(saved.getNom())
                .description(saved.getDescription())
                .nombreProduits(0)
                .build());
    }

    @PutMapping("/categories/{categorieId}")
    public ResponseEntity<BusinessDTOs.CategorieDTO> updateCategory(
            @PathVariable Long categorieId,
            @Valid @RequestBody BusinessDTOs.CategorieDTO dto) {
        Categorie categorie = categorieRepository.findById(categorieId)
            .orElseThrow(() -> new BusinessException("Catégorie introuvable"));

        categorie.setNom(dto.getNom());
        categorie.setDescription(dto.getDescription());
        categorieRepository.save(categorie);

        return ResponseEntity.ok(BusinessDTOs.CategorieDTO.builder()
            .id(categorie.getId())
            .nom(categorie.getNom())
            .description(categorie.getDescription())
            .nombreProduits((int) produitRepository.countByCategorieId(categorie.getId()))
            .build());
    }

    @DeleteMapping("/categories/{categorieId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categorieId) {
        if (!categorieRepository.existsById(categorieId)) {
            throw new BusinessException("Catégorie introuvable");
        }
        categorieRepository.deleteById(categorieId);
        return ResponseEntity.noContent().build();
    }

    // ===== ADMIN DASHBOARD =====

    @GetMapping("/dashboard")
    @Transactional(readOnly = true)
    public ResponseEntity<BusinessDTOs.AdminDashboardDTO> getAdminDashboard() {
        // ✅ Get user and product stats
        long totalVendors = userRepository.countByRole(User.Role.ROLE_VENDOR);
        long approvedVendors = userRepository.countByRoleAndVendorStatus(
            User.Role.ROLE_VENDOR, User.VendorStatus.APPROVED);
        long pendingVendors = userRepository.countByRoleAndVendorStatus(
            User.Role.ROLE_VENDOR, User.VendorStatus.PENDING);
        long totalClients = userRepository.countByRole(User.Role.ROLE_CLIENT);
        long totalProducts = produitRepository.count();
        long totalCategories = categorieRepository.count();

        // ✅ Calculate order stats from database
        List<Order> orders = orderRepository.findAll();
        long totalOrders = orders.size();
        java.math.BigDecimal totalRevenue = orders.stream()
            .map(Order::getTotalAmount)
            .filter(java.util.Objects::nonNull)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        BusinessDTOs.AdminDashboardDTO dashboard = BusinessDTOs.AdminDashboardDTO.builder()
            .totalVendors(totalVendors)
            .approvedVendors(approvedVendors)
            .pendingVendors(pendingVendors)
            .totalClients(totalClients)
            .totalProducts(totalProducts)
            .totalCategories(totalCategories)
            .totalOrders(totalOrders)
            .totalRevenue(totalRevenue)
            .build();

        return ResponseEntity.ok(dashboard);
    }

    private BusinessDTOs.VendorDTO mapToVendorDTO(User vendor) {
        long totalProducts = produitRepository.countByVendorId(vendor.getId());

        // ✅ Calculate vendor orders and revenue
        List<Order> vendorOrders = orderRepository.findByVendorId(vendor.getId());
        long totalOrders = vendorOrders.size();
        java.math.BigDecimal totalRevenue = vendorOrders.stream()
            .map(Order::getTotalAmount)
            .filter(java.util.Objects::nonNull)
            .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        return BusinessDTOs.VendorDTO.builder()
            .id(vendor.getId())
            .username(vendor.getUsername())
            .email(vendor.getEmail())
            .fullName(vendor.getFullName())
            .companyName(vendor.getCompanyName())
            .vendorStatus(vendor.getVendorStatus() != null ? vendor.getVendorStatus().name() : null)
            .rejectionReason(vendor.getRejectionReason())
            .registeredAt(vendor.getRegisteredAt())
            .totalProducts((int) totalProducts)
            .totalOrders(totalOrders)
            .totalRevenue(totalRevenue)
            .build();
    }

    // ===== ORDERS =====

    @GetMapping("/orders")
    @Transactional(readOnly = true)
    public ResponseEntity<List<BusinessDTOs.OrderDTO>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();

        List<BusinessDTOs.OrderDTO> orderDTOs = orders.stream()
            .map(order -> BusinessDTOs.OrderDTO.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .clientId(order.getClient().getId())
                .clientNom(order.getClient().getFullName())
                .vendorId(order.getVendor().getId())
                .vendorCompanyName(order.getVendor().getCompanyName())
                .orderDate(order.getOrderDate())
                .status(order.getStatus().name())
                .subtotal(order.getSubtotal())
                .taxAmount(order.getTaxAmount())
                .discountAmount(order.getDiscountAmount())
                .totalAmount(order.getTotalAmount())
                .shippingAddress(order.getShippingAddress())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }
}
