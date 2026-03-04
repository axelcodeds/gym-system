package com.gym.controller;

import com.gym.dto.request.CreateSubscriptionRequest;
import com.gym.dto.response.SubscriptionResponse;
import com.gym.entity.enums.SubscriptionStatus;
import com.gym.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configure properly for production
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public ResponseEntity<List<SubscriptionResponse>> getAllSubscriptions() {
        List<SubscriptionResponse> subscriptions = subscriptionService.getAllSubscriptions();
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponse> getSubscriptionById(@PathVariable String id) {
        SubscriptionResponse subscription = subscriptionService.getSubscriptionById(id);
        return ResponseEntity.ok(subscription);
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<SubscriptionResponse>> getSubscriptionsByMemberId(@PathVariable String memberId) {
        List<SubscriptionResponse> subscriptions = subscriptionService.getSubscriptionsByMemberId(memberId);
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/member/{memberId}/active")
    public ResponseEntity<SubscriptionResponse> getActiveSubscriptionByMemberId(@PathVariable String memberId) {
        SubscriptionResponse subscription = subscriptionService.getActiveSubscriptionByMemberId(memberId);
        return ResponseEntity.ok(subscription);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<SubscriptionResponse>> getSubscriptionsByStatus(
            @PathVariable SubscriptionStatus status) {
        List<SubscriptionResponse> subscriptions = subscriptionService.getSubscriptionsByStatus(status);
        return ResponseEntity.ok(subscriptions);
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponse> createSubscription(
            @Valid @RequestBody CreateSubscriptionRequest request) {
        SubscriptionResponse subscription = subscriptionService.createSubscription(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(subscription);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<SubscriptionResponse> cancelSubscription(@PathVariable String id) {
        SubscriptionResponse subscription = subscriptionService.cancelSubscription(id);
        return ResponseEntity.ok(subscription);
    }

    @PostMapping("/{id}/toggle-auto-renew")
    public ResponseEntity<SubscriptionResponse> toggleAutoRenew(@PathVariable String id) {
        SubscriptionResponse subscription = subscriptionService.toggleAutoRenew(id);
        return ResponseEntity.ok(subscription);
    }
}
