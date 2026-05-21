package com.venteapp.dto;

import jakarta.validation.constraints.*;
import lombok.*;

public class AuthDTOs {

    @Getter @Setter
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }

    @Getter @Setter
    public static class RegisterRequest {
        @NotBlank @Size(min=3, max=50) private String username;
        @NotBlank @Email private String email;
        @NotBlank @Size(min=6, max=100) private String password;
        private String fullName;
    }

    @Getter @Setter
    public static class VendorRegisterRequest {
        @NotBlank @Size(min=3, max=50) private String username;
        @NotBlank @Email private String email;
        @NotBlank @Size(min=6, max=100) private String password;
        @NotBlank private String fullName;
        @NotBlank private String companyName;
    }

    @Getter @Setter
    public static class ClientRegisterRequest {
        @NotBlank @Size(min=3, max=50) private String username;
        @NotBlank @Email private String email;
        @NotBlank @Size(min=6, max=100) private String password;
        @NotBlank private String fullName;
    }

    @Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String tokenType = "Bearer";
        private String username;
        private String email;
        private String fullName;
        private String role;
        private String vendorStatus;
        private String companyName;
    }

    @Getter @Setter
    public static class RefreshRequest {
        @NotBlank private String refreshToken;
    }
}
