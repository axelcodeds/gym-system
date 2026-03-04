package com.gym.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSubscriptionRequest {

    @NotBlank(message = "Member ID is required")
    private String memberId;

    @NotBlank(message = "Plan ID is required")
    private String planId;

    private String paymentMethodId;

    @Builder.Default
    private Boolean autoRenew = false;
}
