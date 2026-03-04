import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { PlanCardComponent } from '../../../shared/components/plan-card.component';

@Component({
  selector: 'app-admin-subscriptions',
  imports: [PlanCardComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <p class="text-gray-500 mt-1">Manage your gym subscription plans</p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Plan
        </button>
      </div>

      <!-- Weekly Plans -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Weekly Plans</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (plan of subscriptionService.weeklyPlans(); track plan.id) {
            <app-plan-card [plan]="plan" />
          }
        </div>
      </section>

      <!-- Monthly Plans -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Monthly Plans</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (plan of subscriptionService.monthlyPlans(); track plan.id) {
            <app-plan-card [plan]="plan" />
          }
        </div>
      </section>

      <!-- Yearly Plans -->
      <section>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Yearly Plans</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (plan of subscriptionService.yearlyPlans(); track plan.id) {
            <app-plan-card [plan]="plan" />
          }
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSubscriptionsComponent implements OnInit {
  protected readonly subscriptionService = inject(SubscriptionService);

  ngOnInit(): void {
    this.subscriptionService.loadPlans();
  }
}
