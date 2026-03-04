package com.gym.service;

import com.gym.dto.request.RegisterRequest;
import com.gym.dto.request.UpdateUserRequest;
import com.gym.dto.response.DashboardStatsResponse;
import com.gym.dto.response.UserResponse;
import com.gym.entity.User;
import com.gym.entity.enums.MembershipStatus;
import com.gym.entity.enums.Role;
import com.gym.entity.enums.SubscriptionStatus;
import com.gym.exception.BadRequestException;
import com.gym.exception.ResourceNotFoundException;
import com.gym.repository.PaymentRepository;
import com.gym.repository.SubscriptionRepository;
import com.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class MemberService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRepository paymentRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllMembers() {
        return userRepository.findAllMembers().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public UserResponse getMemberById(String id) {
        User member = userRepository.findById(id)
                .filter(user -> user.getRole() == Role.MEMBER)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
        return UserResponse.fromEntity(member);
    }

    public List<UserResponse> searchMembers(String search) {
        return userRepository.searchMembers(search).stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse createMember(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User member = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .role(Role.MEMBER)
                .membershipStatus(MembershipStatus.INACTIVE)
                .build();

        User savedMember = userRepository.save(member);
        return UserResponse.fromEntity(savedMember);
    }

    @Transactional
    public UserResponse updateMember(String id, UpdateUserRequest request) {
        User member = userRepository.findById(id)
                .filter(user -> user.getRole() == Role.MEMBER)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        if (request.getEmail() != null && !request.getEmail().equals(member.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            member.setEmail(request.getEmail());
        }

        if (request.getFirstName() != null) {
            member.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            member.setLastName(request.getLastName());
        }
        if (request.getPhone() != null) {
            member.setPhone(request.getPhone());
        }
        if (request.getAvatarUrl() != null) {
            member.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getMembershipStatus() != null) {
            member.setMembershipStatus(request.getMembershipStatus());
        }

        User updatedMember = userRepository.save(member);
        return UserResponse.fromEntity(updatedMember);
    }

    @Transactional
    public void deleteMember(String id) {
        User member = userRepository.findById(id)
                .filter(user -> user.getRole() == Role.MEMBER)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));

        userRepository.delete(member);
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalMembers = userRepository.countByRole(Role.MEMBER);
        long activeMembers = userRepository.countMembersByStatus(MembershipStatus.ACTIVE);
        long expiredMembers = userRepository.countMembersByStatus(MembershipStatus.EXPIRED);
        long inactiveMembers = userRepository.countMembersByStatus(MembershipStatus.INACTIVE);
        long activeSubscriptions = subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);

        BigDecimal totalRevenue = paymentRepository.calculateTotalRevenue();

        return DashboardStatsResponse.builder()
                .totalMembers(totalMembers)
                .activeMembers(activeMembers)
                .expiredMembers(expiredMembers)
                .inactiveMembers(inactiveMembers)
                .activeSubscriptions(activeSubscriptions)
                .totalRevenue(totalRevenue != null ? totalRevenue.longValue() : 0)
                .build();
    }

    public List<UserResponse> getMembersByStatus(MembershipStatus status) {
        return userRepository.findByRoleAndMembershipStatus(Role.MEMBER, status).stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
