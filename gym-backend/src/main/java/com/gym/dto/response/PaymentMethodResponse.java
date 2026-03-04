package com.gym.dto.response;

import com.gym.entity.PaymentMethod;
import com.gym.entity.enums.PaymentMethodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethodResponse {

    private String id;
    private PaymentMethodType type;
    private String last4;
    private String brand;
    private Integer expiryMonth;
    private Integer expiryYear;
    private Boolean isDefault;

    public static PaymentMethodResponse fromEntity(PaymentMethod paymentMethod) {
        return PaymentMethodResponse.builder()
                .id(paymentMethod.getId())
                .type(paymentMethod.getType())
                .last4(paymentMethod.getLast4())
                .brand(paymentMethod.getBrand())
                .expiryMonth(paymentMethod.getExpiryMonth())
                .expiryYear(paymentMethod.getExpiryYear())
                .isDefault(paymentMethod.getIsDefault())
                .build();
    }
}
