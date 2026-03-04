package com.gym.service;

import com.gym.dto.request.CreateSubscriptionPlanRequest;
import com.gym.dto.response.SubscriptionPlanResponse;
import com.gym.entity.SubscriptionPlan;
import com.gym.entity.enums.SubscriptionPeriod;
import com.gym.exception.BadRequestException;
import com.gym.exception.ResourceNotFoundException;
import com.gym.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class SubscriptionPlanService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public List<SubscriptionPlanResponse> getAllPlans() {
        return subscriptionPlanRepository.findByActiveTrue().stream()
                .map(SubscriptionPlanResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<SubscriptionPlanResponse> getActivePlans() {
        return getAllPlans();
    }

    public SubscriptionPlanResponse getPlanById(String id) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with id: " + id));
        return SubscriptionPlanResponse.fromEntity(plan);
    }

    public List<SubscriptionPlanResponse> getPlansByPeriod(SubscriptionPeriod period) {
        return subscriptionPlanRepository.findByPeriodAndActiveTrue(period).stream()
                .map(SubscriptionPlanResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<SubscriptionPlanResponse> getPopularPlans() {
        return subscriptionPlanRepository.findByPopularTrue().stream()
                .map(SubscriptionPlanResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionPlanResponse createPlan(CreateSubscriptionPlanRequest request) {
        if (subscriptionPlanRepository.existsByName(request.getName())) {
            throw new BadRequestException("Plan with this name already exists");
        }

        SubscriptionPlan plan = SubscriptionPlan.builder()
                .name(request.getName())
                .period(request.getPeriod())
                .price(request.getPrice())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .features(request.getFeatures() != null ? request.getFeatures() : new ArrayList<>())
                .popular(request.getPopular() != null ? request.getPopular() : false)
                .active(true)
                .build();

        SubscriptionPlan savedPlan = subscriptionPlanRepository.save(plan);
        return SubscriptionPlanResponse.fromEntity(savedPlan);
    }

    @Transactional
    public SubscriptionPlanResponse updatePlan(String id, CreateSubscriptionPlanRequest request) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with id: " + id));

        if (request.getName() != null && !request.getName().equals(plan.getName())) {
            if (subscriptionPlanRepository.existsByName(request.getName())) {
                throw new BadRequestException("Plan with this name already exists");
            }
            plan.setName(request.getName());
        }

        if (request.getPeriod() != null) {
            plan.setPeriod(request.getPeriod());
        }
        if (request.getPrice() != null) {
            plan.setPrice(request.getPrice());
        }
        if (request.getCurrency() != null) {
            plan.setCurrency(request.getCurrency());
        }
        if (request.getFeatures() != null) {
            plan.setFeatures(request.getFeatures());
        }
        if (request.getPopular() != null) {
            plan.setPopular(request.getPopular());
        }

        SubscriptionPlan updatedPlan = subscriptionPlanRepository.save(plan);
        return SubscriptionPlanResponse.fromEntity(updatedPlan);
    }

    @Transactional
    public void deletePlan(String id) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan not found with id: " + id));

        // Soft delete - just mark as inactive
        plan.setActive(false);
        subscriptionPlanRepository.save(plan);
    }

    @Transactional
    public void hardDeletePlan(String id) {
        if (!subscriptionPlanRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subscription plan not found with id: " + id);
        }
        subscriptionPlanRepository.deleteById(id);
    }
}
