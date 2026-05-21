package com.venteapp.controller;

import com.venteapp.dto.BusinessDTOs;
import com.venteapp.entity.*;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.*;
import com.venteapp.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vendor")
@RequiredArgsConstructor
public class VendorController {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final OrderRepository orderRepository;
    private final NotificationRepository notificationRepository;
    private final JwtUtils jwtUtils;

    private User getCurrentVendor(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new BusinessException("Authentification requise");
        }

        String username = auth.getName();
        User vendor = userRepository.findByUsername(username)
            .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        if (vendor.getRole() != User.Role.ROLE_VENDOR) {
            throw new BusinessException("Accès refusé: vous n'êtes pas un vendeur");
        }

        if (vendor.getVendorStatus() != User.VendorStatus.APPROVED) {
            throw new BusinessException("Accès refusé: votre compte vendeur doit être approuvé");
        }

        return vendor;
    }

    // ===== DASHBOARD =====

    @GetMapping("/debug/auth")
    public ResponseEntity<Map<String, Object>> debugAuth(Authentication auth) {
        Map<String, Object> debug = new HashMap<>();
        debug.put("authenticated", auth != null && auth.isAuthenticated());
        if (auth != null) {
            debug.put("principal", auth.getPrincipal());
            debug.put("authorities", auth.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .collect(Collectors.toList()));
            debug.put("name", auth.getName());
        }
        return ResponseEntity.ok(debug);
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional(readOnly = true)
    public ResponseEntity<BusinessDTOs.VendorDashboardDTO> getDashboard(Authentication auth) {
        User vendor = getCurrentVendor(auth);

        // ✅ Get products stats
        long totalProducts = produitRepository.countByVendorId(vendor.getId());
        long lowStockProducts = produitRepository.findLowStockByVendor(vendor.getId()).size();

        // ✅ Calculate orders stats from database
        List<Order> orders = orderRepository.findByVendorId(vendor.getId());
        long totalOrders = orders.size();
        BigDecimal totalRevenue = orders.stream()
            .map(Order::getTotalAmount)
            .filter(java.util.Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BusinessDTOs.VendorDashboardDTO dashboard = BusinessDTOs.VendorDashboardDTO.builder()
            .vendorId(vendor.getId())
            .vendorName(vendor.getCompanyName())
            .totalProducts(totalProducts)
            .lowStockProducts(lowStockProducts)
            .totalOrders(totalOrders)
            .totalRevenue(totalRevenue)
            .build();

        return ResponseEntity.ok(dashboard);
    }

    // ===== PRODUCTS =====

    @GetMapping("/products")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<BusinessDTOs.ProduitDTO>> getVendorProducts(Authentication auth) {
        User vendor = getCurrentVendor(auth);

        List<BusinessDTOs.ProduitDTO> products = produitRepository.findByVendorId(vendor.getId()).stream()
            .map(p -> {
                Integer stockMin = p.getStockMinimum() != null ? p.getStockMinimum() : 5;
                return BusinessDTOs.ProduitDTO.builder()
                    .id(p.getId())
                    .nom(p.getNom())
                    .description(p.getDescription())
                    .reference(p.getReference())
                    .prix(p.getPrix())
                    .prixAchat(p.getPrixAchat() != null ? p.getPrixAchat() : BigDecimal.ZERO)
                    .stock(p.getStock())
                    .stockMinimum(stockMin)
                    .categorieId(p.getCategorie() != null ? p.getCategorie().getId() : null)
                    .categorieNom(p.getCategorie() != null ? p.getCategorie().getNom() : null)
                    .actif(p.isActif())
                    .createdAt(p.getCreatedAt())
                    .stockFaible(p.getStock() <= stockMin)
                    .build();
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<BusinessDTOs.ProduitDTO> createProduct(
            @Valid @RequestBody BusinessDTOs.ProduitDTO dto,
            Authentication auth) {
        User vendor = getCurrentVendor(auth);

        if (produitRepository.existsByReference(dto.getReference())) {
            throw new BusinessException("Un produit avec cette référence existe déjà");
        }

        Categorie categorie = null;
        if (dto.getCategorieId() != null) {
            categorie = categorieRepository.findById(dto.getCategorieId())
                .orElseThrow(() -> new BusinessException("Catégorie introuvable"));
        }

        Produit product = Produit.builder()
            .nom(dto.getNom())
            .description(dto.getDescription())
            .reference(dto.getReference())
            .prix(dto.getPrix())
            .prixAchat(dto.getPrixAchat() != null ? dto.getPrixAchat() : BigDecimal.ZERO)
            .stock(dto.getStock() != null ? dto.getStock() : 0)
            .stockMinimum(dto.getStockMinimum() != null ? dto.getStockMinimum() : 5)
            .categorie(categorie)
            .vendor(vendor)
            .actif(true)
            .createdAt(LocalDateTime.now())
            .build();

        Produit saved = produitRepository.save(product);

        Integer stockMin = saved.getStockMinimum() != null ? saved.getStockMinimum() : 5;
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(BusinessDTOs.ProduitDTO.builder()
                .id(saved.getId())
                .nom(saved.getNom())
                .description(saved.getDescription())
                .reference(saved.getReference())
                .prix(saved.getPrix())
                .prixAchat(saved.getPrixAchat() != null ? saved.getPrixAchat() : BigDecimal.ZERO)
                .stock(saved.getStock())
                .stockMinimum(stockMin)
                .categorieId(saved.getCategorie() != null ? saved.getCategorie().getId() : null)
                .categorieNom(saved.getCategorie() != null ? saved.getCategorie().getNom() : null)
                .actif(saved.isActif())
                .createdAt(saved.getCreatedAt())
                .stockFaible(saved.getStock() <= stockMin)
                .build());
    }

    @PutMapping("/products/{productId}")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional
    public ResponseEntity<BusinessDTOs.ProduitDTO> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody BusinessDTOs.ProduitDTO dto,
            Authentication auth) {
        User vendor = getCurrentVendor(auth);

        Produit product = produitRepository.findById(productId)
            .orElseThrow(() -> new BusinessException("Produit introuvable"));

        if (!product.getVendor().getId().equals(vendor.getId())) {
            throw new BusinessException("Vous n'êtes pas autorisé à modifier ce produit");
        }

        Categorie categorie = null;
        if (dto.getCategorieId() != null) {
            categorie = categorieRepository.findById(dto.getCategorieId())
                .orElseThrow(() -> new BusinessException("Catégorie introuvable"));
        }

        product.setNom(dto.getNom());
        product.setDescription(dto.getDescription());
        product.setPrix(dto.getPrix());
        product.setPrixAchat(dto.getPrixAchat());
        product.setStock(dto.getStock());
        product.setStockMinimum(dto.getStockMinimum());
        product.setCategorie(categorie);
        product.setActif(dto.isActif());

        Produit updated = produitRepository.save(product);

        Integer stockMin = updated.getStockMinimum() != null ? updated.getStockMinimum() : 5;
        return ResponseEntity.ok(BusinessDTOs.ProduitDTO.builder()
            .id(updated.getId())
            .nom(updated.getNom())
            .description(updated.getDescription())
            .reference(updated.getReference())
            .prix(updated.getPrix())
            .prixAchat(updated.getPrixAchat() != null ? updated.getPrixAchat() : BigDecimal.ZERO)
            .stock(updated.getStock())
            .stockMinimum(stockMin)
            .categorieId(updated.getCategorie() != null ? updated.getCategorie().getId() : null)
            .categorieNom(updated.getCategorie() != null ? updated.getCategorie().getNom() : null)
            .actif(updated.isActif())
            .createdAt(updated.getCreatedAt())
            .stockFaible(updated.getStock() <= stockMin)
            .build());
    }

    @DeleteMapping("/products/{productId}")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long productId,
            Authentication auth) {
        User vendor = getCurrentVendor(auth);

        Produit product = produitRepository.findById(productId)
            .orElseThrow(() -> new BusinessException("Produit introuvable"));

        if (!product.getVendor().getId().equals(vendor.getId())) {
            throw new BusinessException("Vous n'êtes pas autorisé à supprimer ce produit");
        }

        produitRepository.deleteById(productId);
        return ResponseEntity.noContent().build();
    }

    // ===== NOTIFICATIONS =====

    @GetMapping("/notifications")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<BusinessDTOs.NotificationDTO>> getNotifications(Authentication auth) {
        User vendor = getCurrentVendor(auth);

        List<BusinessDTOs.NotificationDTO> notifications = notificationRepository
            .findByVendorIdOrderByCreatedAtDesc(vendor.getId()).stream()
            .map(n -> BusinessDTOs.NotificationDTO.builder()
                .id(n.getId())
                .vendorId(n.getVendor() != null ? n.getVendor().getId() : null)
                .type(n.getType().name())
                .title(n.getTitle())
                .message(n.getMessage())
                .productId(n.getProduct() != null ? n.getProduct().getId() : null)
                .productName(n.getProduct() != null ? n.getProduct().getNom() : null)
                .orderId(n.getOrder() != null ? n.getOrder().getId() : null)
                .orderNumber(n.getOrder() != null ? n.getOrder().getOrderNumber() : null)
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/notifications/unread")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<BusinessDTOs.NotificationDTO>> getUnreadNotifications(Authentication auth) {
        User vendor = getCurrentVendor(auth);

        List<BusinessDTOs.NotificationDTO> notifications = notificationRepository
            .findUnreadByVendor(vendor.getId()).stream()
            .map(n -> BusinessDTOs.NotificationDTO.builder()
                .id(n.getId())
                .vendorId(n.getVendor() != null ? n.getVendor().getId() : null)
                .type(n.getType().name())
                .title(n.getTitle())
                .message(n.getMessage())
                .productId(n.getProduct() != null ? n.getProduct().getId() : null)
                .productName(n.getProduct() != null ? n.getProduct().getNom() : null)
                .orderId(n.getOrder() != null ? n.getOrder().getId() : null)
                .orderNumber(n.getOrder() != null ? n.getOrder().getOrderNumber() : null)
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build())
            .collect(Collectors.toList());

        return ResponseEntity.ok(notifications);
    }

    @PatchMapping("/notifications/{notificationId}/read")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional
    public ResponseEntity<BusinessDTOs.NotificationDTO> markNotificationAsRead(
            @PathVariable Long notificationId,
            Authentication auth) {
        User vendor = getCurrentVendor(auth);

        Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new BusinessException("Notification introuvable"));

        if (!notification.getVendor().getId().equals(vendor.getId())) {
            throw new BusinessException("Vous n'êtes pas autorisé à accéder à cette notification");
        }

        notification.setIsRead(true);
        Notification updated = notificationRepository.save(notification);

        return ResponseEntity.ok(BusinessDTOs.NotificationDTO.builder()
            .id(updated.getId())
            .vendorId(updated.getVendor() != null ? updated.getVendor().getId() : null)
            .type(updated.getType().name())
            .title(updated.getTitle())
            .message(updated.getMessage())
            .productId(updated.getProduct() != null ? updated.getProduct().getId() : null)
            .productName(updated.getProduct() != null ? updated.getProduct().getNom() : null)
            .orderId(updated.getOrder() != null ? updated.getOrder().getId() : null)
            .orderNumber(updated.getOrder() != null ? updated.getOrder().getOrderNumber() : null)
            .isRead(updated.getIsRead())
            .createdAt(updated.getCreatedAt())
            .build());
    }

    // ===== ORDERS =====

    @GetMapping("/orders")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional(readOnly = true)
    public ResponseEntity<List<BusinessDTOs.OrderDTO>> getVendorOrders(Authentication auth) {
        User vendor = getCurrentVendor(auth);
        List<Order> orders = orderRepository.findByVendorId(vendor.getId());

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

    @GetMapping("/orders/{orderId}")
    @PreAuthorize("hasRole('VENDOR')")
    @Transactional(readOnly = true)
    public ResponseEntity<BusinessDTOs.OrderDTO> getVendorOrder(
            @PathVariable Long orderId,
            Authentication auth) {
        User vendor = getCurrentVendor(auth);
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new BusinessException("Commande non trouvée"));

        if (!order.getVendor().getId().equals(vendor.getId())) {
            throw new BusinessException("Accès refusé: cette commande ne vous appartient pas");
        }

        BusinessDTOs.OrderDTO orderDTO = BusinessDTOs.OrderDTO.builder()
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
            .build();

        return ResponseEntity.ok(orderDTO);
    }
}
