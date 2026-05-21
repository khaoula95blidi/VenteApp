package com.venteapp.service;

import com.venteapp.dto.AuthDTOs;
import com.venteapp.entity.User;
import com.venteapp.exception.BusinessException;
import com.venteapp.repository.UserRepository;
import com.venteapp.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthDTOs.AuthResponse login(AuthDTOs.LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new BusinessException("Utilisateur introuvable"));

        if (user.getRole() == User.Role.ROLE_VENDOR && user.getVendorStatus() == User.VendorStatus.PENDING) {
            throw new BusinessException("Votre compte vendeur est en attente d'approbation par l'administrateur");
        }

        if (user.getRole() == User.Role.ROLE_VENDOR && user.getVendorStatus() == User.VendorStatus.REJECTED) {
            throw new BusinessException("Votre compte vendeur a été rejeté. Raison: " + user.getRejectionReason());
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String accessToken = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        return AuthDTOs.AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .username(user.getUsername())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole().name())
            .vendorStatus(user.getVendorStatus() != null ? user.getVendorStatus().name() : null)
            .companyName(user.getCompanyName())
            .build();
    }

    @Transactional
    public AuthDTOs.AuthResponse register(AuthDTOs.RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Nom d'utilisateur déjà pris");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email déjà utilisé");
        }

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getFullName())
            .role(User.Role.ROLE_CLIENT)
            .enabled(true)
            .registeredAt(LocalDateTime.now())
            .build();

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String accessToken = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        return AuthDTOs.AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .username(user.getUsername())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole().name())
            .build();
    }

    @Transactional
    public AuthDTOs.AuthResponse registerVendor(AuthDTOs.VendorRegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Nom d'utilisateur déjà pris");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email déjà utilisé");
        }

        User vendor = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getFullName())
            .companyName(request.getCompanyName())
            .role(User.Role.ROLE_VENDOR)
            .vendorStatus(User.VendorStatus.PENDING)
            .enabled(true)
            .registeredAt(LocalDateTime.now())
            .build();

        userRepository.save(vendor);

        return AuthDTOs.AuthResponse.builder()
            .username(vendor.getUsername())
            .email(vendor.getEmail())
            .fullName(vendor.getFullName())
            .companyName(vendor.getCompanyName())
            .role(vendor.getRole().name())
            .vendorStatus(vendor.getVendorStatus().name())
            .build();
    }

    @Transactional
    public AuthDTOs.AuthResponse registerClient(AuthDTOs.ClientRegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Nom d'utilisateur déjà pris");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email déjà utilisé");
        }

        User client = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getFullName())
            .role(User.Role.ROLE_CLIENT)
            .enabled(true)
            .registeredAt(LocalDateTime.now())
            .build();

        userRepository.save(client);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String accessToken = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        return AuthDTOs.AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .username(client.getUsername())
            .email(client.getEmail())
            .fullName(client.getFullName())
            .role(client.getRole().name())
            .build();
    }

    public AuthDTOs.AuthResponse refresh(AuthDTOs.RefreshRequest request) {
        String username = jwtUtils.extractUsername(request.getRefreshToken());
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        if (!jwtUtils.validateToken(request.getRefreshToken(), userDetails)) {
            throw new BusinessException("Token de rafraîchissement invalide");
        }

        String accessToken = jwtUtils.generateToken(userDetails);

        User user = userRepository.findByUsername(username).orElseThrow();
        return AuthDTOs.AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(request.getRefreshToken())
            .username(user.getUsername())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole().name())
            .build();
    }
}
