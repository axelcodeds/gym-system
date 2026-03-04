package com.gym.dto.request;

import com.gym.entity.enums.PaymentMethodType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePaymentMethodRequest {

    @NotNull(message = "Payment method type is required")
    @Builder.Default
    private PaymentMethodType type = PaymentMethodType.CARD;

    @NotBlank(message = "Card number is required")
    private String cardNumber;

    @NotBlank(message = "Card brand is required")
    private String brand;

    @NotNull(message = "Expiry month is required")
    @Min(value = 1, message = "Expiry month must be between 1 and 12")
    @Max(value = 12, message = "Expiry month must be between 1 and 12")
    private Integer expiryMonth;

    @NotNull(message = "Expiry year is required")
    private Integer expiryYear;

    @Builder.Default
    private Boolean isDefault = false;
}
