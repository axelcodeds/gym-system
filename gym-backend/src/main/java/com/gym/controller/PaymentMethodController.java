package com.gym.controller;

import com.gym.dto.request.CreatePaymentMethodRequest;
import com.gym.dto.response.PaymentMethodResponse;
import com.gym.service.PaymentMethodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configure properly for production
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentMethodResponse>> getPaymentMethodsByUserId(@PathVariable String userId) {
        List<PaymentMethodResponse> paymentMethods = paymentMethodService.getPaymentMethodsByUserId(userId);
        return ResponseEntity.ok(paymentMethods);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentMethodResponse> getPaymentMethodById(@PathVariable String id) {
        PaymentMethodResponse paymentMethod = paymentMethodService.getPaymentMethodById(id);
        return ResponseEntity.ok(paymentMethod);
    }

    @GetMapping("/user/{userId}/default")
    public ResponseEntity<PaymentMethodResponse> getDefaultPaymentMethod(@PathVariable String userId) {
        PaymentMethodResponse paymentMethod = paymentMethodService.getDefaultPaymentMethod(userId);
        return ResponseEntity.ok(paymentMethod);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<PaymentMethodResponse> createPaymentMethod(
            @PathVariable String userId,
            @Valid @RequestBody CreatePaymentMethodRequest request) {
        PaymentMethodResponse paymentMethod = paymentMethodService.createPaymentMethod(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentMethod);
    }

    @PostMapping("/{id}/set-default")
    public ResponseEntity<PaymentMethodResponse> setDefaultPaymentMethod(@PathVariable String id) {
        PaymentMethodResponse paymentMethod = paymentMethodService.setDefaultPaymentMethod(id);
        return ResponseEntity.ok(paymentMethod);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable String id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.noContent().build();
    }
}
