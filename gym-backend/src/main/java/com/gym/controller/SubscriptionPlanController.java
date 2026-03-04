package com.gym.controller;

import com.gym.dto.request.CreateSubscriptionPlanRequest;
import com.gym.dto.response.SubscriptionPlanResponse;
import com.gym.entity.enums.SubscriptionPeriod;
import com.gym.service.SubscriptionPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configure properly for production
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    @GetMapping
    public ResponseEntity<List<SubscriptionPlanResponse>> getAllPlans() {
        List<SubscriptionPlanResponse> plans = subscriptionPlanService.getAllPlans();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/active")
    public ResponseEntity<List<SubscriptionPlanResponse>> getActivePlans() {
        List<SubscriptionPlanResponse> plans = subscriptionPlanService.getActivePlans();
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponse> getPlanById(@PathVariable String id) {
        SubscriptionPlanResponse plan = subscriptionPlanService.getPlanById(id);
        return ResponseEntity.ok(plan);
    }

    @GetMapping("/period/{period}")
    public ResponseEntity<List<SubscriptionPlanResponse>> getPlansByPeriod(@PathVariable SubscriptionPeriod period) {
        List<SubscriptionPlanResponse> plans = subscriptionPlanService.getPlansByPeriod(period);
        return ResponseEntity.ok(plans);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<SubscriptionPlanResponse>> getPopularPlans() {
        List<SubscriptionPlanResponse> plans = subscriptionPlanService.getPopularPlans();
        return ResponseEntity.ok(plans);
    }

    @PostMapping
    public ResponseEntity<SubscriptionPlanResponse> createPlan(
            @Valid @RequestBody CreateSubscriptionPlanRequest request) {
        SubscriptionPlanResponse plan = subscriptionPlanService.createPlan(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(plan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponse> updatePlan(
            @PathVariable String id,
            @Valid @RequestBody CreateSubscriptionPlanRequest request) {
        SubscriptionPlanResponse plan = subscriptionPlanService.updatePlan(id, request);
        return ResponseEntity.ok(plan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        subscriptionPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}
