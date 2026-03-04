package com.gym.repository;

import com.gym.entity.Payment;
import com.gym.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    List<Payment> findBySubscriptionId(String subscriptionId);

    @Query("SELECT p FROM Payment p WHERE p.subscription.member.id = :memberId ORDER BY p.paymentDate DESC")
    List<Payment> findByMemberId(String memberId);

    List<Payment> findByStatus(PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    List<Payment> findByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCEEDED'")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCEEDED' AND p.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal calculateRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT p FROM Payment p JOIN FETCH p.subscription s JOIN FETCH s.member ORDER BY p.paymentDate DESC")
    List<Payment> findAllWithDetails();
}
