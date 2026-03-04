package com.gym.config;

import com.gym.entity.SubscriptionPlan;
import com.gym.entity.User;
import com.gym.entity.enums.MembershipStatus;
import com.gym.entity.enums.Role;
import com.gym.entity.enums.SubscriptionPeriod;
import com.gym.repository.SubscriptionPlanRepository;
import com.gym.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * DataLoader - Seeds initial data for development and testing.
 * This will run every time the application starts with H2 (create-drop mode).
 * Remove or disable this in production.
 */
@Component
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class DataLoader implements CommandLineRunner {

        private final UserRepository userRepository;
        private final SubscriptionPlanRepository subscriptionPlanRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                log.info("Starting data initialization...");

                loadUsers();
                loadSubscriptionPlans();

                log.info("Data initialization completed!");
        }

        private void loadUsers() {
                if (userRepository.count() > 0) {
                        log.info("Users already exist, skipping user seed...");
                        return;
                }

                // Create Admin User
                User admin = User.builder()
                                .email("admin@gym.com")
                                .password(passwordEncoder.encode("admin123"))
                                .firstName("Admin")
                                .lastName("User")
                                .phone("+1 555-0100")
                                .role(Role.ADMIN)
                                .build();
                userRepository.save(admin);
                log.info("Created admin user: admin@gym.com / admin123");

                // Create Member Users
                List<User> members = Arrays.asList(
                                User.builder()
                                                .email("john.doe@email.com")
                                                .password(passwordEncoder.encode("member123"))
                                                .firstName("John")
                                                .lastName("Doe")
                                                .phone("+1 555-0101")
                                                .role(Role.MEMBER)
                                                .membershipStatus(MembershipStatus.ACTIVE)
                                                .joinDate(LocalDateTime.of(2024, 1, 15, 10, 0))
                                                .build(),
                                User.builder()
                                                .email("jane.smith@email.com")
                                                .password(passwordEncoder.encode("member123"))
                                                .firstName("Jane")
                                                .lastName("Smith")
                                                .phone("+1 555-0102")
                                                .role(Role.MEMBER)
                                                .membershipStatus(MembershipStatus.ACTIVE)
                                                .joinDate(LocalDateTime.of(2024, 2, 20, 10, 0))
                                                .build(),
                                User.builder()
                                                .email("mike.wilson@email.com")
                                                .password(passwordEncoder.encode("member123"))
                                                .firstName("Mike")
                                                .lastName("Wilson")
                                                .phone("+1 555-0103")
                                                .role(Role.MEMBER)
                                                .membershipStatus(MembershipStatus.EXPIRED)
                                                .joinDate(LocalDateTime.of(2023, 11, 10, 10, 0))
                                                .build(),
                                User.builder()
                                                .email("sarah.johnson@email.com")
                                                .password(passwordEncoder.encode("member123"))
                                                .firstName("Sarah")
                                                .lastName("Johnson")
                                                .phone("+1 555-0104")
                                                .role(Role.MEMBER)
                                                .membershipStatus(MembershipStatus.ACTIVE)
                                                .joinDate(LocalDateTime.of(2024, 3, 5, 10, 0))
                                                .build(),
                                User.builder()
                                                .email("chris.brown@email.com")
                                                .password(passwordEncoder.encode("member123"))
                                                .firstName("Chris")
                                                .lastName("Brown")
                                                .phone("+1 555-0105")
                                                .role(Role.MEMBER)
                                                .membershipStatus(MembershipStatus.INACTIVE)
                                                .joinDate(LocalDateTime.of(2024, 1, 25, 10, 0))
                                                .build());

                userRepository.saveAll(members);
                log.info("Created {} member users", members.size());
        }

        private void loadSubscriptionPlans() {
                if (subscriptionPlanRepository.count() > 0) {
                        log.info("Subscription plans already exist, skipping plan seed...");
                        return;
                }

                List<SubscriptionPlan> plans = Arrays.asList(
                                SubscriptionPlan.builder()
                                                .name("Weekly Pass")
                                                .period(SubscriptionPeriod.WEEKLY)
                                                .price(new BigDecimal("15.00"))
                                                .currency("USD")
                                                .features(Arrays.asList(
                                                                "Full gym access",
                                                                "Locker room access",
                                                                "Basic equipment usage"))
                                                .popular(false)
                                                .active(true)
                                                .build(),
                                SubscriptionPlan.builder()
                                                .name("Monthly Standard")
                                                .period(SubscriptionPeriod.MONTHLY)
                                                .price(new BigDecimal("49.00"))
                                                .currency("USD")
                                                .features(Arrays.asList(
                                                                "Full gym access",
                                                                "Locker room access",
                                                                "All equipment usage",
                                                                "Group classes",
                                                                "Fitness assessment"))
                                                .popular(true)
                                                .active(true)
                                                .build(),
                                SubscriptionPlan.builder()
                                                .name("Monthly Premium")
                                                .period(SubscriptionPeriod.MONTHLY)
                                                .price(new BigDecimal("79.00"))
                                                .currency("USD")
                                                .features(Arrays.asList(
                                                                "Full gym access",
                                                                "Locker room access",
                                                                "All equipment usage",
                                                                "Unlimited group classes",
                                                                "Personal trainer (2 sessions)",
                                                                "Nutrition consultation",
                                                                "Towel service"))
                                                .popular(false)
                                                .active(true)
                                                .build(),
                                SubscriptionPlan.builder()
                                                .name("Yearly Standard")
                                                .period(SubscriptionPeriod.YEARLY)
                                                .price(new BigDecimal("399.00"))
                                                .currency("USD")
                                                .features(Arrays.asList(
                                                                "Full gym access",
                                                                "Locker room access",
                                                                "All equipment usage",
                                                                "Group classes",
                                                                "Fitness assessment",
                                                                "2 months free"))
                                                .popular(false)
                                                .active(true)
                                                .build(),
                                SubscriptionPlan.builder()
                                                .name("Yearly Premium")
                                                .period(SubscriptionPeriod.YEARLY)
                                                .price(new BigDecimal("699.00"))
                                                .currency("USD")
                                                .features(Arrays.asList(
                                                                "Full gym access",
                                                                "Locker room access",
                                                                "All equipment usage",
                                                                "Unlimited group classes",
                                                                "Personal trainer (monthly)",
                                                                "Nutrition consultation",
                                                                "Towel service",
                                                                "Guest passes (4/year)",
                                                                "3 months free"))
                                                .popular(true)
                                                .active(true)
                                                .build());

                subscriptionPlanRepository.saveAll(plans);
                log.info("Created {} subscription plans", plans.size());
        }
}
