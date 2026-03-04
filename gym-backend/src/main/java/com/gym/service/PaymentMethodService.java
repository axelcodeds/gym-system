package com.gym.service;

import com.gym.dto.request.CreatePaymentMethodRequest;
import com.gym.dto.response.PaymentMethodResponse;
import com.gym.entity.PaymentMethod;
import com.gym.entity.User;
import com.gym.exception.BadRequestException;
import com.gym.exception.ResourceNotFoundException;
import com.gym.repository.PaymentMethodRepository;
import com.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    public List<PaymentMethodResponse> getPaymentMethodsByUserId(String userId) {
        return paymentMethodRepository.findByUserId(userId).stream()
                .map(PaymentMethodResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public PaymentMethodResponse getPaymentMethodById(String id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found with id: " + id));
        return PaymentMethodResponse.fromEntity(paymentMethod);
    }

    public PaymentMethodResponse getDefaultPaymentMethod(String userId) {
        PaymentMethod paymentMethod = paymentMethodRepository.findByUserIdAndIsDefaultTrue(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("No default payment method found for user: " + userId));
        return PaymentMethodResponse.fromEntity(paymentMethod);
    }

    @Transactional
    public PaymentMethodResponse createPaymentMethod(String userId, CreatePaymentMethodRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Extract last 4 digits from card number
        String last4 = extractLast4Digits(request.getCardNumber());

        // Check if card already exists
        if (paymentMethodRepository.existsByUserIdAndLast4(userId, last4)) {
            throw new BadRequestException("This card is already registered");
        }

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            paymentMethodRepository.findByUserIdAndIsDefaultTrue(userId)
                    .ifPresent(existing -> {
                        existing.setIsDefault(false);
                        paymentMethodRepository.save(existing);
                    });
        }

        // If this is the first payment method, make it default
        boolean isFirstPaymentMethod = paymentMethodRepository.findByUserId(userId).isEmpty();

        PaymentMethod paymentMethod = PaymentMethod.builder()
                .user(user)
                .type(request.getType())
                .last4(last4)
                .brand(request.getBrand())
                .expiryMonth(request.getExpiryMonth())
                .expiryYear(request.getExpiryYear())
                .isDefault(isFirstPaymentMethod || Boolean.TRUE.equals(request.getIsDefault()))
                .build();

        PaymentMethod savedPaymentMethod = paymentMethodRepository.save(paymentMethod);
        return PaymentMethodResponse.fromEntity(savedPaymentMethod);
    }

    @Transactional
    public PaymentMethodResponse setDefaultPaymentMethod(String id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found with id: " + id));

        // Unset current default
        paymentMethodRepository.findByUserIdAndIsDefaultTrue(paymentMethod.getUser().getId())
                .ifPresent(existing -> {
                    existing.setIsDefault(false);
                    paymentMethodRepository.save(existing);
                });

        // Set new default
        paymentMethod.setIsDefault(true);
        PaymentMethod savedPaymentMethod = paymentMethodRepository.save(paymentMethod);

        return PaymentMethodResponse.fromEntity(savedPaymentMethod);
    }

    @Transactional
    public void deletePaymentMethod(String id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found with id: " + id));

        if (paymentMethod.getIsDefault()) {
            throw new BadRequestException("Cannot delete default payment method. Set another as default first.");
        }

        paymentMethodRepository.delete(paymentMethod);
    }

    private String extractLast4Digits(String cardNumber) {
        String digitsOnly = cardNumber.replaceAll("[^0-9]", "");
        if (digitsOnly.length() < 4) {
            throw new BadRequestException("Invalid card number");
        }
        return digitsOnly.substring(digitsOnly.length() - 4);
    }
}
