package com.gym.repository;

import com.gym.entity.User;
import com.gym.entity.enums.MembershipStatus;
import com.gym.entity.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRoleAndMembershipStatus(Role role, MembershipStatus membershipStatus);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = 'MEMBER' AND u.membershipStatus = :status")
    long countMembersByStatus(MembershipStatus status);

    @Query("SELECT u FROM User u WHERE u.role = 'MEMBER' ORDER BY u.createdAt DESC")
    List<User> findAllMembers();

    @Query("SELECT u FROM User u WHERE u.role = 'MEMBER' AND " +
            "(LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<User> searchMembers(String search);
}
