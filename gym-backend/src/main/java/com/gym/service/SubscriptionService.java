package com.gym.service;

import com.gym.dto.request.CreateSubscriptionRequest;
import com.gym.dto.response.SubscriptionResponse;
import com.gym.entity.PaymentMethod;
import com.gym.entity.Subscription;
import com.gym.entity.SubscriptionPlan;
import com.gym.entity.User;
import com.gym.entity.enums.MembershipStatus;
import com.gym.entity.enums.Role;
import com.gym.entity.enums.SubscriptionPeriod;
import com.gym.entity.enums.SubscriptionStatus;
import com.gym.exception.BadRequestException;
import com.gym.exception.ResourceNotFoundException;
import com.gym.repository.PaymentMethodRepository;
import com.gym.repository.SubscriptionPlanRepository;
import com.gym.repository.SubscriptionRepository;
import com.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final UserRepository userRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public List<SubscriptionResponse> getAllSubscriptions() {
        return subscriptionRepository.findAllWithMemberAndPlan().stream()
                .map(SubscriptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public SubscriptionResponse getSubscriptionById(String id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));
        return SubscriptionResponse.fromEntity(subscription);
    }

    public List<SubscriptionResponse> getSubscriptionsByMemberId(String memberId) {
        return subscriptionRepository.findByMemberId(memberId).stream()
                .map(SubscriptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public SubscriptionResponse getActiveSubscriptionByMemberId(String memberId) {
        Subscription subscription = subscriptionRepository.findActiveSubscriptionByMemberId(memberId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("No active subscription found for member: " + memberId));
        return SubscriptionResponse.fromEntity(subscription);
    }

    public List<SubscriptionResponse> getSubscriptionsByStatus(SubscriptionStatus status) {
        return subscriptionRepository.findByStatus(status).stream()
                .map(SubscriptionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionResponse createSubscription(CreateSubscriptionRequest request) {
        User member = userRepository.findById(request.getMemberId())
                .filter(user -> user.getRole() == Role.MEMBER)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + request.getMemberId()));

        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subscription plan not found with id: " + request.getPlanId()));

        // Check if member already has an active subscription
        subscriptionRepository.findActiveSubscriptionByMemberId(request.getMemberId())
                .ifPresent(existing -> {
                    throw new BadRequestException("Member already has an active subscription");
                });

        PaymentMethod paymentMethod = null;
        if (request.getPaymentMethodId() != null) {
            paymentMethod = paymentMethodRepository.findById(request.getPaymentMethodId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Payment method not found with id: " + request.getPaymentMethodId()));
        }

        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = calculateEndDate(startDate, plan.getPeriod());

        Subscription subscription = Subscription.builder()
                .member(member)
                .plan(plan)
                .status(SubscriptionStatus.ACTIVE)
                .startDate(startDate)
                .endDate(endDate)
                .autoRenew(request.getAutoRenew() != null ? request.getAutoRenew() : false)
                .paymentMethod(paymentMethod)
                .build();

        Subscription savedSubscription = subscriptionRepository.save(subscription);

        // Update member's membership status
        member.setMembershipStatus(MembershipStatus.ACTIVE);
        userRepository.save(member);

        return SubscriptionResponse.fromEntity(savedSubscription);
    }

    @Transactional
    public SubscriptionResponse cancelSubscription(String id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            throw new BadRequestException("Can only cancel active subscriptions");
        }

        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscription.setAutoRenew(false);

        Subscription savedSubscription = subscriptionRepository.save(subscription);

        // Update member's membership status
        User member = subscription.getMember();
        member.setMembershipStatus(MembershipStatus.INACTIVE);
        userRepository.save(member);

        return SubscriptionResponse.fromEntity(savedSubscription);
    }

    @Transactional
    public SubscriptionResponse toggleAutoRenew(String id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id: " + id));

        subscription.setAutoRenew(!subscription.getAutoRenew());
        Subscription savedSubscription = subscriptionRepository.save(subscription);

        return SubscriptionResponse.fromEntity(savedSubscription);
    }

    @Transactional
    public void checkAndExpireSubscriptions() {
        List<Subscription> expiredSubscriptions = subscriptionRepository
                .findExpiredActiveSubscriptions(LocalDateTime.now());

        for (Subscription subscription : expiredSubscriptions) {
            subscription.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(subscription);

            User member = subscription.getMember();
            member.setMembershipStatus(MembershipStatus.EXPIRED);
            userRepository.save(member);
        }
    }

    private LocalDateTime calculateEndDate(LocalDateTime startDate, SubscriptionPeriod period) {
        return switch (period) {
            case WEEKLY -> startDate.plusWeeks(1);
            case MONTHLY -> startDate.plusMonths(1);
            case YEARLY -> startDate.plusYears(1);
        };
    }
}
