package com.venteapp.repository;

import com.venteapp.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByVendorId(Long vendorId);

    @Query("SELECT n FROM Notification n WHERE n.vendor.id = :vendorId AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByVendor(@Param("vendorId") Long vendorId);

    List<Notification> findByVendorIdOrderByCreatedAtDesc(Long vendorId);
}
