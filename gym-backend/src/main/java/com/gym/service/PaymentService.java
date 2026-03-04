package com.gym.service;

import com.gym.dto.response.PaymentResponse;
import com.gym.entity.Payment;
import com.gym.entity.Subscription;
import com.gym.entity.enums.PaymentStatus;
import com.gym.exception.ResourceNotFoundException;
import com.gym.repository.PaymentRepository;
import com.gym.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final SubscriptionRepository subscriptionRepository;

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAllWithDetails().stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public PaymentResponse getPaymentById(String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return PaymentResponse.fromEntity(payment);
    }

    public List<PaymentResponse> getPaymentsByMemberId(String memberId) {
        return paymentRepository.findByMemberId(memberId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsBySubscriptionId(String subscriptionId) {
        return paymentRepository.findBySubscriptionId(subscriptionId).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return paymentRepository.findByDateRange(startDate, endDate).stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentResponse processPayment(String subscriptionId, BigDecimal amount, String description) {
        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + subscriptionId));

        // TODO: Integrate with actual payment gateway
        // For now, we simulate a successful payment
        Payment payment = Payment.builder()
                .subscription(subscription)
                .amount(amount)
                .currency(subscription.getPlan().getCurrency())
                .status(PaymentStatus.SUCCEEDED)
                .paymentDate(LocalDateTime.now())
                .description(description)
                .transactionId(generateTransactionId())
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        return PaymentResponse.fromEntity(savedPayment);
    }

    @Transactional
    public PaymentResponse refundPayment(String paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + paymentId));

        if (payment.getStatus() != PaymentStatus.SUCCEEDED) {
            throw new IllegalStateException("Can only refund successful payments");
        }

        // TODO: Process refund through payment gateway
        payment.setStatus(PaymentStatus.REFUNDED);
        Payment savedPayment = paymentRepository.save(payment);

        return PaymentResponse.fromEntity(savedPayment);
    }

    public BigDecimal getTotalRevenue() {
        BigDecimal total = paymentRepository.calculateTotalRevenue();
        return total != null ? total : BigDecimal.ZERO;
    }

    public BigDecimal getRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal total = paymentRepository.calculateRevenueByDateRange(startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    private String generateTransactionId() {
        return "TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
