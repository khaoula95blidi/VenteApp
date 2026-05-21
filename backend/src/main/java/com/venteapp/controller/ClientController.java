package com.venteapp.controller;

import com.venteapp.dto.BusinessDTOs;
import com.venteapp.entity.*;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/client")
@PreAuthorize("hasRole('CLIENT')")
@RequiredArgsConstructor
public class ClientController {

    private final UserRepository userRepository;
    private final ProduitRepository produitRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final NotificationRepository notificationRepository;

    private User getCurrentClient(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new BusinessException("Authentification requise");
        }

        String username = auth.getName();
        User client = userRepository.findByUsername(username)
            .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        if (client.getRole() != User.Role.ROLE_CLIENT) {
            throw new BusinessException("Accès refusé: vous n'êtes pas un client");
        }

        return client;
    }

    // ===== PROFILE =====

    @GetMapping("/profile")
    public ResponseEntity<BusinessDTOs.ClientProfileDTO> getProfile(Authentication auth) {
        User client = getCurrentClient(auth);

        BusinessDTOs.ClientProfileDTO profile = BusinessDTOs.ClientProfileDTO.builder()
            .id(client.getId())
            .username(client.getUsername())
            .email(client.getEmail())
            .fullName(client.getFullName())
            .registeredAt(client.getRegisteredAt())
            .build();

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<BusinessDTOs.ClientProfileDTO> updateProfile(
            @Valid @RequestBody BusinessDTOs.ClientProfileUpdateDTO dto,
            Authentication auth) {
        User client = getCurrentClient(auth);

        if (dto.getEmail() != null && !dto.getEmail().equals(client.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new BusinessException("Cet email est déjà utilisé");
            }
            client.setEmail(dto.getEmail());
        }

        if (dto.getFullName() != null && !dto.getFullName().isEmpty()) {
            client.setFullName(dto.getFullName());
        }

        userRepository.save(client);

        return ResponseEntity.ok(BusinessDTOs.ClientProfileDTO.builder()
            .id(client.getId())
            .username(client.getUsername())
            .email(client.getEmail())
            .fullName(client.getFullName())
            .registeredAt(client.getRegisteredAt())
            .build());
    }

    // ===== ORDERS =====

    @GetMapping("/orders")
    @Transactional(readOnly = true)
    public ResponseEntity<List<BusinessDTOs.OrderDTO>> getOrders(Authentication auth) {
        User client = getCurrentClient(auth);
        List<Order> orders = orderRepository.findByClientId(client.getId());

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
    @Transactional(readOnly = true)
    public ResponseEntity<BusinessDTOs.OrderDTO> getOrder(
            @PathVariable Long orderId,
            Authentication auth) {
        User client = getCurrentClient(auth);
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new BusinessException("Commande non trouvée"));

        if (!order.getClient().getId().equals(client.getId())) {
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

    @PostMapping("/orders")
    @Transactional
    public ResponseEntity<?> createOrder(
            @RequestBody Map<String, Object> orderData,
            Authentication auth) {
        try {
            User client = getCurrentClient(auth);

            // Extract data from request with safe parsing
            final Long vendorId;  // ✅ Declare as final
            if (orderData.get("vendorId") instanceof Number) {
                vendorId = ((Number) orderData.get("vendorId")).longValue();
            } else {
                return ResponseEntity.badRequest().body("Invalid vendorId");
            }

            // Validate items type
            Object itemsObj = orderData.get("items");
            if (!(itemsObj instanceof List)) {
                return ResponseEntity.badRequest().body("Items must be a list");
            }
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) itemsObj;

            String deliveryAddress = (String) orderData.get("deliveryAddress");
            if (deliveryAddress == null || deliveryAddress.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Delivery address is required");
            }

            if (items == null || items.isEmpty()) {
                return ResponseEntity.badRequest().body("Le panier est vide");
            }

            // Validate vendor exists
            User vendor = userRepository.findById(vendorId)
                .orElseThrow(() -> new BusinessException("Vendeur introuvable avec ID: " + vendorId));  // ✅ Now final

            if (vendor.getRole() != User.Role.ROLE_VENDOR) {
                return ResponseEntity.badRequest().body("Utilisateur n'est pas un vendeur");
            }

            // Create order with initialized items list
            Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .orderDate(LocalDateTime.now())
                .client(client)
                .vendor(vendor)
                .status(Order.OrderStatus.PENDING)
                .shippingAddress(deliveryAddress)
                .subtotal(java.math.BigDecimal.ZERO)
                .taxAmount(java.math.BigDecimal.ZERO)
                .discountAmount(java.math.BigDecimal.ZERO)
                .totalAmount(java.math.BigDecimal.ZERO)
                .notes("")
                .items(new ArrayList<>())
                .build();

            java.math.BigDecimal subtotal = java.math.BigDecimal.ZERO;

            // Process items
            for (Map<String, Object> itemData : items) {
                Long productId = null;
                Integer quantity = null;

                if (itemData.get("productId") instanceof Number) {
                    productId = ((Number) itemData.get("productId")).longValue();
                }
                if (itemData.get("quantity") instanceof Number) {
                    quantity = ((Number) itemData.get("quantity")).intValue();
                }

                if (productId == null || quantity == null) {
                    return ResponseEntity.badRequest().body("Invalid item data: productId or quantity");
                }
                if (quantity <= 0) {
                    return ResponseEntity.badRequest().body("Quantity must be greater than 0");
                }

                // ✅ Create final copy for use in lambda
                final Long finalProductId = productId;
                Produit product = produitRepository.findById(finalProductId)
                    .orElseThrow(() -> new BusinessException("Produit introuvable: " + finalProductId));

                // Verify product belongs to vendor
                if (!product.getVendor().getId().equals(vendorId)) {
                    return ResponseEntity.badRequest().body("Produit n'appartient pas au vendeur");
                }

                // Safe stock check
                int currentStock = product.getStock() != null ? product.getStock() : 0;
                if (currentStock < quantity) {
                    return ResponseEntity.badRequest().body("Stock insuffisant pour: " + product.getNom() + " (disponible: " + currentStock + ")");
                }

                // Validate product price
                java.math.BigDecimal unitPrice = product.getPrix();
                if (unitPrice == null) {
                    return ResponseEntity.badRequest().body("Produit '" + product.getNom() + "' has no price");
                }

                // Create order item
                java.math.BigDecimal itemSubtotal = unitPrice.multiply(new java.math.BigDecimal(quantity));
                OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .subtotal(itemSubtotal)
                    .build();

                order.getItems().add(orderItem);
                subtotal = subtotal.add(itemSubtotal);

                // Decrement stock
                product.setStock(currentStock - quantity);
                produitRepository.save(product);

                // Create low stock notification if needed
                Integer stockMinimum = product.getStockMinimum() != null ? product.getStockMinimum() : 5;
                if (product.getStock() <= stockMinimum && product.getStock() >= 0) {
                    Notification notification = Notification.builder()
                        .vendor(vendor)
                        .type(Notification.NotificationType.LOW_STOCK_ALERT)
                        .title("Stock faible")
                        .message("Produit '" + product.getNom() + "' - Stock: " + product.getStock() + " unités")
                        .product(product)
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();
                    notificationRepository.save(notification);
                }
            }

            // Calculate totals
            order.setSubtotal(subtotal);
            order.setTaxAmount(java.math.BigDecimal.ZERO);
            order.setDiscountAmount(java.math.BigDecimal.ZERO);
            order.setTotalAmount(subtotal);

            Order savedOrder = orderRepository.save(order);

            // Build response
            BusinessDTOs.OrderDTO response = BusinessDTOs.OrderDTO.builder()
                .id(savedOrder.getId())
                .orderNumber(savedOrder.getOrderNumber())
                .clientId(savedOrder.getClient().getId())
                .vendorId(savedOrder.getVendor().getId())
                .status(savedOrder.getStatus().name())
                .subtotal(savedOrder.getSubtotal())
                .totalAmount(savedOrder.getTotalAmount())
                .shippingAddress(savedOrder.getShippingAddress())
                .createdAt(savedOrder.getCreatedAt())
                .build();

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (BusinessException e) {
            return ResponseEntity.badRequest().body("Erreur métier: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();  // Print to Spring Boot console
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erreur serveur: " + e.getClass().getSimpleName() + " - " + e.getMessage());
        }
    }

    private String generateOrderNumber() {
        LocalDateTime now = LocalDateTime.now();
        String timestamp = String.format("%04d%02d%02d%02d%02d%02d",
            now.getYear(), now.getMonthValue(), now.getDayOfMonth(),
            now.getHour(), now.getMinute(), now.getSecond());
        long random = System.nanoTime() % 10000;
        return "ORD-" + timestamp + "-" + String.format("%04d", random);
    }

    @PatchMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Object> cancelOrder(
            @PathVariable Long orderId,
            Authentication auth) {
        User client = getCurrentClient(auth);
        throw new BusinessException("Annulation de commande non encore implémentée");
    }

    // ===== DEBUG =====
    @GetMapping("/debug/all-orders")
    @Transactional(readOnly = true)
    public ResponseEntity<Map<String, Object>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        Map<String, Object> debug = new HashMap<>();
        debug.put("totalOrders", orders.size());
        debug.put("orders", orders.stream().map(o -> {
            Map<String, Object> order = new HashMap<>();
            order.put("id", o.getId());
            order.put("orderNumber", o.getOrderNumber());
            order.put("clientId", o.getClient().getId());
            order.put("vendorId", o.getVendor().getId());
            order.put("status", o.getStatus().name());
            order.put("totalAmount", o.getTotalAmount());
            return order;
        }).collect(Collectors.toList()));
        return ResponseEntity.ok(debug);
    }
}
