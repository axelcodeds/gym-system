package com.gym.repository;

import com.gym.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, String> {

    List<PaymentMethod> findByUserId(String userId);

    Optional<PaymentMethod> findByUserIdAndIsDefaultTrue(String userId);

    boolean existsByUserIdAndLast4(String userId, String last4);
}
