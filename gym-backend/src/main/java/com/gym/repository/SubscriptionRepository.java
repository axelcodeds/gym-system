package com.gym.repository;

import com.gym.entity.Subscription;
import com.gym.entity.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, String> {

    List<Subscription> findByMemberId(String memberId);

    Optional<Subscription> findByMemberIdAndStatus(String memberId, SubscriptionStatus status);

    @Query("SELECT s FROM Subscription s WHERE s.member.id = :memberId AND s.status = 'ACTIVE' ORDER BY s.endDate DESC")
    Optional<Subscription> findActiveSubscriptionByMemberId(String memberId);

    List<Subscription> findByStatus(SubscriptionStatus status);

    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.status = :status")
    long countByStatus(SubscriptionStatus status);

    @Query("SELECT s FROM Subscription s WHERE s.endDate < :date AND s.status = 'ACTIVE'")
    List<Subscription> findExpiredActiveSubscriptions(LocalDateTime date);

    @Query("SELECT s FROM Subscription s WHERE s.endDate BETWEEN :startDate AND :endDate AND s.autoRenew = true AND s.status = 'ACTIVE'")
    List<Subscription> findSubscriptionsDueForRenewal(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT s FROM Subscription s JOIN FETCH s.member JOIN FETCH s.plan ORDER BY s.createdAt DESC")
    List<Subscription> findAllWithMemberAndPlan();
}
