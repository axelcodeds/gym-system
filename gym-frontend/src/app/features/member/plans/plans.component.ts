import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { AuthService } from '../../../core/services/auth.service';
import { PlanCardComponent } from '../../../shared/components/plan-card.component';
import { SubscriptionPlan, SubscriptionPeriod } from '../../../core/models/subscription.model';

@Component({
  selector: 'app-plans',
  imports: [PlanCardComponent, TitleCasePipe],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p class="text-gray-500 mt-2 max-w-2xl mx-auto">
          Select the perfect membership plan for your fitness goals. All plans include full gym
          access.
        </p>
      </div>

      <!-- Loading State -->
      @if (subscriptionService.isLoading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      } @else {
        <!-- Period Toggle -->
        <div class="flex justify-center">
          <div class="inline-flex items-center p-1 bg-gray-100 rounded-xl">
            @for (period of periods; track period.value) {
              <button
                type="button"
                class="px-6 py-2.5 rounded-lg font-medium text-sm transition-all"
                [class.bg-white]="selectedPeriod() === period.value"
                [class.shadow-sm]="selectedPeriod() === period.value"
                [class.text-gray-900]="selectedPeriod() === period.value"
                [class.text-gray-500]="selectedPeriod() !== period.value"
                (click)="selectedPeriod.set(period.value)"
              >
                {{ period.label }}
              </button>
            }
          </div>
        </div>

        <!-- Plans Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          @for (plan of displayedPlans(); track plan.id) {
            <app-plan-card
              [plan]="plan"
              [isSelected]="selectedPlan()?.id === plan.id"
              [isCurrentPlan]="currentPlanId() === plan.id"
              (select)="onSelectPlan($event)"
            />
          }
        </div>

        <!-- Checkout Section -->
        @if (selectedPlan(); as plan) {
          <div class="max-w-2xl mx-auto">
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Plan</span>
                  <span class="font-medium text-gray-900">{{ plan.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Billing Period</span>
                  <span class="font-medium text-gray-900">{{ plan.period | titlecase }}</span>
                </div>
                <div class="border-t border-gray-200 pt-3 flex justify-between">
                  <span class="text-gray-900 font-semibold">Total</span>
                  <span class="text-2xl font-bold text-gray-900">{{ '$' + plan.price }}</span>
                </div>
              </div>
              <button
                type="button"
                class="w-full mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="processing() || currentPlanId() === plan.id"
                (click)="checkout()"
              >
                @if (processing()) {
                  Processing...
                } @else if (currentPlanId() === plan.id) {
                  Current Plan
                } @else {
                  Subscribe Now
                }
              </button>
              <p class="text-center text-sm text-gray-500 mt-4">Cancel anytime. No hidden fees.</p>
            </div>
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansComponent implements OnInit {
  protected readonly subscriptionService = inject(SubscriptionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly periods: { value: SubscriptionPeriod; label: string }[] = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  protected readonly selectedPeriod = signal<SubscriptionPeriod>('monthly');
  protected readonly selectedPlan = signal<SubscriptionPlan | null>(null);
  protected readonly processing = signal(false);

  ngOnInit(): void {
    this.subscriptionService.loadPlans();
  }

  protected readonly currentPlanId = computed(
    () => this.subscriptionService.subscription()?.planId ?? '',
  );

  protected readonly displayedPlans = computed(() => {
    const period = this.selectedPeriod();
    switch (period) {
      case 'weekly':
        return this.subscriptionService.weeklyPlans();
      case 'monthly':
        return this.subscriptionService.monthlyPlans();
      case 'yearly':
        return this.subscriptionService.yearlyPlans();
      default:
        return [];
    }
  });

  protected onSelectPlan(plan: SubscriptionPlan): void {
    if (this.currentPlanId() !== plan.id) {
      this.selectedPlan.set(plan);
    }
  }

  protected async checkout(): Promise<void> {
    const plan = this.selectedPlan();
    const user = this.authService.user();
    if (!plan || !user) return;

    this.processing.set(true);
    const success = await this.subscriptionService.selectPlan(plan.id, user.id);
    this.processing.set(false);

    if (success) {
      this.router.navigate(['/member/subscription']);
    }
  }
}
