package com.gym.dto.response;

import com.gym.entity.Subscription;
import com.gym.entity.enums.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionResponse {

    private String id;
    private String memberId;
    private String planId;
    private SubscriptionPlanResponse plan;
    private SubscriptionStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean autoRenew;
    private PaymentMethodResponse paymentMethod;

    public static SubscriptionResponse fromEntity(Subscription subscription) {
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .memberId(subscription.getMember().getId())
                .planId(subscription.getPlan().getId())
                .plan(SubscriptionPlanResponse.fromEntity(subscription.getPlan()))
                .status(subscription.getStatus())
                .startDate(subscription.getStartDate())
                .endDate(subscription.getEndDate())
                .autoRenew(subscription.getAutoRenew())
                .paymentMethod(subscription.getPaymentMethod() != null
                        ? PaymentMethodResponse.fromEntity(subscription.getPaymentMethod())
                        : null)
                .build();
    }
}
