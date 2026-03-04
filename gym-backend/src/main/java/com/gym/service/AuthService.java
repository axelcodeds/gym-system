package com.gym.service;

import com.gym.dto.request.LoginRequest;
import com.gym.dto.request.RegisterRequest;
import com.gym.dto.response.AuthResponse;
import com.gym.dto.response.UserResponse;
import com.gym.entity.User;
import com.gym.entity.enums.MembershipStatus;
import com.gym.entity.enums.Role;
import com.gym.exception.BadRequestException;
import com.gym.exception.ResourceNotFoundException;
import com.gym.exception.UnauthorizedException;
import com.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : Role.MEMBER)
                .membershipStatus(MembershipStatus.INACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        // TODO: Generate actual JWT token when implementing full security
        String token = generateTemporaryToken(savedUser);

        return AuthResponse.of(token, UserResponse.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        // TODO: Generate actual JWT token when implementing full security
        String token = generateTemporaryToken(user);

        return AuthResponse.of(token, UserResponse.fromEntity(user));
    }

    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromEntity(user);
    }

    // Temporary token generation - will be replaced with proper JWT
    private String generateTemporaryToken(User user) {
        return "temp_token_" + user.getId() + "_" + System.currentTimeMillis();
    }
}
