import { Component, inject, signal, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-subscription',
  imports: [TitleCasePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Subscription</h1>
        <p class="text-gray-500 mt-1">Manage your subscription settings</p>
      </div>

      @if (subscription(); as sub) {
        <!-- Current Subscription Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h2 class="text-xl font-semibold text-gray-900">{{ sub.plan.name }}</h2>
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                  [class.bg-green-100]="sub.status === 'active'"
                  [class.text-green-700]="sub.status === 'active'"
                  [class.bg-orange-100]="sub.status === 'cancelled'"
                  [class.text-orange-700]="sub.status === 'cancelled'"
                  [class.bg-red-100]="sub.status === 'expired'"
                  [class.text-red-700]="sub.status === 'expired'"
                >
                  {{ sub.status | titlecase }}
                </span>
              </div>
              <p class="text-gray-500">{{ sub.plan.period | titlecase }} subscription</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-gray-900">{{ '$' + sub.plan.price }}</p>
              <p class="text-gray-500">/{{ sub.plan.period }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div>
              <p class="text-sm text-gray-500">Start Date</p>
              <p class="font-semibold text-gray-900 mt-1">{{ formatDate(sub.startDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Next Billing Date</p>
              <p class="font-semibold text-gray-900 mt-1">{{ formatDate(sub.endDate) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Auto-Renew</p>
              <div class="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  role="switch"
                  [attr.aria-checked]="sub.autoRenew"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                  [class.bg-indigo-600]="sub.autoRenew"
                  [class.bg-gray-200]="!sub.autoRenew"
                  (click)="toggleAutoRenew()"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    [class.translate-x-5]="sub.autoRenew"
                    [class.translate-x-0]="!sub.autoRenew"
                  ></span>
                </button>
                <span class="text-gray-700">{{ sub.autoRenew ? 'On' : 'Off' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Method -->
        @if (sub.paymentMethod; as pm) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg
                    class="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ pm.brand }} •••• {{ pm.last4 }}</p>
                  <p class="text-sm text-gray-500">
                    Expires {{ pm.expiryMonth }}/{{ pm.expiryYear }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        }

        <!-- Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Subscription Actions</h3>
          <div class="space-y-4">
            @if (sub.status === 'active') {
              <button
                type="button"
                class="w-full sm:w-auto px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                [disabled]="cancelling()"
                (click)="cancelSubscription()"
              >
                @if (cancelling()) {
                  Cancelling...
                } @else {
                  Cancel Subscription
                }
              </button>
              <p class="text-sm text-gray-500">
                You can cancel your subscription at any time. Your access will continue until the
                end of the current billing period.
              </p>
            } @else if (sub.status === 'cancelled') {
              <div class="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p class="text-orange-800 font-medium">Your subscription has been cancelled</p>
                <p class="text-orange-600 text-sm mt-1">
                  Access will end on {{ formatDate(sub.endDate) }}. Reactivate anytime to continue.
                </p>
              </div>
            }
          </div>
        </div>
      } @else {
        <!-- No Subscription -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div
            class="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p class="text-gray-500 mb-6">
            Start your fitness journey by choosing a plan that fits your needs.
          </p>
          <a
            href="/member/plans"
            class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Plans
          </a>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionComponent implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly authService = inject(AuthService);

  protected readonly subscription = this.subscriptionService.subscription;
  protected readonly cancelling = signal(false);

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.subscriptionService.loadPlans();
      this.subscriptionService.loadCurrentSubscription(user.id);
    }
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }

  protected toggleAutoRenew(): void {
    this.subscriptionService.toggleAutoRenew();
  }

  protected async cancelSubscription(): Promise<void> {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      this.cancelling.set(true);
      await this.subscriptionService.cancelSubscription();
      this.cancelling.set(false);
    }
  }
}
