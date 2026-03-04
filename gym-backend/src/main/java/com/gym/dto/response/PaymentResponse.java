package com.gym.dto.response;

import com.gym.entity.Payment;
import com.gym.entity.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private String id;
    private String subscriptionId;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private LocalDateTime date;
    private String description;

    public static PaymentResponse fromEntity(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .subscriptionId(payment.getSubscription().getId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .date(payment.getPaymentDate())
                .description(payment.getDescription())
                .build();
    }
}
