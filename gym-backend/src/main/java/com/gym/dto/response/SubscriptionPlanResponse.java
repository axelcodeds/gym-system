package com.gym.dto.response;

import com.gym.entity.SubscriptionPlan;
import com.gym.entity.enums.SubscriptionPeriod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionPlanResponse {

    private String id;
    private String name;
    private SubscriptionPeriod period;
    private BigDecimal price;
    private String currency;
    private List<String> features;
    private Boolean popular;

    public static SubscriptionPlanResponse fromEntity(SubscriptionPlan plan) {
        return SubscriptionPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .period(plan.getPeriod())
                .price(plan.getPrice())
                .currency(plan.getCurrency())
                .features(plan.getFeatures())
                .popular(plan.getPopular())
                .build();
    }
}
