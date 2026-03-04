package com.gym.dto.response;

import com.gym.entity.User;
import com.gym.entity.enums.MembershipStatus;
import com.gym.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private Role role;
    private String avatarUrl;
    private MembershipStatus membershipStatus;
    private LocalDateTime joinDate;
    private LocalDateTime createdAt;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .membershipStatus(user.getMembershipStatus())
                .joinDate(user.getJoinDate())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
