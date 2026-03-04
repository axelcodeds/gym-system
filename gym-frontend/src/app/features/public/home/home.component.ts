import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <!-- Navigation -->
    <header class="absolute top-0 left-0 right-0 z-50">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="bg-indigo-600 text-white p-2 rounded-lg font-bold text-lg">GYM</span>
            <span class="text-xl font-bold text-white">FitLife</span>
          </div>
          <div class="hidden md:flex items-center gap-8">
            <a href="#features" class="text-white/80 hover:text-white transition-colors"
              >Features</a
            >
            <a href="#plans" class="text-white/80 hover:text-white transition-colors">Plans</a>
            <a href="#about" class="text-white/80 hover:text-white transition-colors">About</a>
          </div>
          <div class="flex items-center gap-4">
            <button
              type="button"
              (click)="loginAsAdmin()"
              class="text-white/80 hover:text-white transition-colors font-medium"
            >
              Admin
            </button>
            <button
              type="button"
              (click)="loginAsMember()"
              class="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Member Login
            </button>
          </div>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 overflow-hidden"
    >
      <div class="absolute inset-0 bg-black/20"></div>
      <div
        class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[40px_40px]"
      ></div>

      <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Transform Your Body,
          <span class="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">
            Transform Your Life
          </span>
        </h1>
        <p class="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Join FitLife Gym and start your fitness journey today. State-of-the-art equipment, expert
          trainers, and a community that supports your goals.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#plans"
            class="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-lg"
          >
            View Membership Plans
          </a>
          <a
            href="#about"
            class="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-lg border border-white/20"
          >
            Learn More
          </a>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          class="h-8 w-8 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Why Choose FitLife?</h2>
          <p class="text-xl text-gray-500 max-w-2xl mx-auto">
            We provide everything you need to achieve your fitness goals
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (feature of features; track feature.title) {
            <div class="p-8 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors">
              <div class="h-14 w-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                <span [innerHTML]="feature.icon" class="h-7 w-7 text-indigo-600"></span>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ feature.title }}</h3>
              <p class="text-gray-500">{{ feature.description }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Plans Section -->
    <section id="plans" class="py-24 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">Membership Plans</h2>
          <p class="text-xl text-gray-500 max-w-2xl mx-auto">
            Choose the plan that fits your lifestyle
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          @for (plan of plans; track plan.name) {
            <div
              class="relative bg-white rounded-2xl shadow-sm border-2 p-8"
              [class.border-indigo-500]="plan.popular"
              [class.border-gray-200]="!plan.popular"
            >
              @if (plan.popular) {
                <div
                  class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-sm font-semibold px-4 py-1 rounded-full"
                >
                  Most Popular
                </div>
              }
              <h3 class="text-xl font-semibold text-gray-900">{{ plan.name }}</h3>
              <p class="text-gray-500 mt-1">{{ plan.period }}</p>
              <div class="mt-6">
                <span class="text-4xl font-bold text-gray-900">{{ '$' + plan.price }}</span>
                <span class="text-gray-500"
                  >/{{
                    plan.period.toLowerCase().includes('week')
                      ? 'week'
                      : plan.period.toLowerCase().includes('month')
                        ? 'month'
                        : 'year'
                  }}</span
                >
              </div>
              <ul class="mt-6 space-y-3">
                @for (feature of plan.features; track feature) {
                  <li class="flex items-center gap-2 text-gray-600">
                    <svg
                      class="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {{ feature }}
                  </li>
                }
              </ul>
              <button
                type="button"
                class="w-full mt-8 py-3 px-6 rounded-xl font-semibold transition-colors"
                [class.bg-indigo-600]="plan.popular"
                [class.text-white]="plan.popular"
                [class.hover:bg-indigo-700]="plan.popular"
                [class.bg-gray-100]="!plan.popular"
                [class.text-gray-900]="!plan.popular"
                [class.hover:bg-gray-200]="!plan.popular"
                (click)="loginAsMember()"
              >
                Get Started
              </button>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-indigo-600">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
        <p class="text-xl text-indigo-100 mb-10">
          Join thousands of members who have transformed their lives with FitLife Gym.
        </p>
        <button
          type="button"
          (click)="loginAsMember()"
          class="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-lg"
        >
          Join Now - Start Free Trial
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer id="about" class="bg-gray-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <span class="bg-indigo-600 text-white p-2 rounded-lg font-bold text-lg">GYM</span>
              <span class="text-xl font-bold">FitLife</span>
            </div>
            <p class="text-gray-400 max-w-md">
              FitLife Gym is dedicated to helping you achieve your fitness goals with
              state-of-the-art facilities and expert guidance.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#features" class="hover:text-white transition-colors">Features</a></li>
              <li><a href="#plans" class="hover:text-white transition-colors">Plans</a></li>
              <li><a href="#about" class="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Contact</h4>
            <ul class="space-y-2 text-gray-400">
              <li>123 Fitness Street</li>
              <li>New York, NY 10001</li>
              <li>contact&#64;fitlife.gym</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2026 FitLife Gym. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly features = [
    {
      title: 'Modern Equipment',
      description:
        'State-of-the-art fitness equipment from top brands, regularly maintained for optimal performance.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>',
    },
    {
      title: 'Expert Trainers',
      description:
        'Certified personal trainers ready to guide you through customized workout plans.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>',
    },
    {
      title: 'Group Classes',
      description:
        'Join energizing group fitness classes from yoga to HIIT, led by experienced instructors.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>',
    },
    {
      title: 'Flexible Hours',
      description: 'Open 24/7 to fit your schedule. Work out whenever it suits you best.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    },
    {
      title: 'Nutrition Support',
      description:
        'Get personalized nutrition plans and dietary advice from our certified nutritionists.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>',
    },
    {
      title: 'Member App',
      description:
        'Track your progress, book classes, and manage your membership from our mobile app.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>',
    },
  ];

  protected readonly plans = [
    {
      name: 'Weekly Pass',
      period: 'Weekly',
      price: 15,
      features: ['Full gym access', 'Locker room', 'Basic equipment'],
      popular: false,
    },
    {
      name: 'Monthly Standard',
      period: 'Monthly',
      price: 49,
      features: ['Full gym access', 'All equipment', 'Group classes', 'Fitness assessment'],
      popular: true,
    },
    {
      name: 'Yearly Premium',
      period: 'Yearly',
      price: 699,
      features: [
        'Everything included',
        'Personal trainer',
        'Nutrition consultation',
        '3 months free',
      ],
      popular: false,
    },
  ];

  protected loginAsAdmin(): void {
    this.authService.setMockUser('admin');
    this.router.navigate(['/admin']);
  }

  protected loginAsMember(): void {
    this.authService.setMockUser('member');
    this.router.navigate(['/member']);
  }
}
