package com.venteapp.repository;

import com.venteapp.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByClientId(Long clientId);
    List<Order> findByVendorId(Long vendorId);

    @Query("SELECT o FROM Order o WHERE o.vendor.id = :vendorId AND o.status != 'CANCELLED'")
    List<Order> findActiveOrdersByVendor(@Param("vendorId") Long vendorId);

    @Query("SELECT o FROM Order o WHERE o.client.id = :clientId AND o.status != 'CANCELLED'")
    List<Order> findActiveOrdersByClient(@Param("clientId") Long clientId);
}
