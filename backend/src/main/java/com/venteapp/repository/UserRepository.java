package com.venteapp.repository;

import com.venteapp.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Vendor-specific queries
    Page<User> findByRole(User.Role role, Pageable pageable);
    List<User> findByRoleAndVendorStatus(User.Role role, User.VendorStatus vendorStatus);
    Page<User> findByRoleAndVendorStatus(User.Role role, User.VendorStatus vendorStatus, Pageable pageable);
    long countByRole(User.Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.vendorStatus = :status")
    long countByRoleAndVendorStatus(@Param("role") User.Role role, @Param("status") User.VendorStatus status);
}
