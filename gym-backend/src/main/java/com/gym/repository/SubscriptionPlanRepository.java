package com.gym.repository;

import com.gym.entity.SubscriptionPlan;
import com.gym.entity.enums.SubscriptionPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, String> {

    List<SubscriptionPlan> findByActiveTrue();

    List<SubscriptionPlan> findByPeriod(SubscriptionPeriod period);

    List<SubscriptionPlan> findByPeriodAndActiveTrue(SubscriptionPeriod period);

    List<SubscriptionPlan> findByPopularTrue();

    boolean existsByName(String name);
}
