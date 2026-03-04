import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payments',
  imports: [TitleCasePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Payment History</h1>
        <p class="text-gray-500 mt-1">View your past transactions</p>
      </div>

      <!-- Payment List -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (payment of payments(); track payment.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-gray-900">
                    {{ formatDate(payment.date) }}
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-gray-900">{{ payment.description }}</p>
                    <p class="text-sm text-gray-500">ID: {{ payment.id }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="px-3 py-1 text-xs font-semibold rounded-full"
                      [class.bg-green-100]="payment.status === 'succeeded'"
                      [class.text-green-700]="payment.status === 'succeeded'"
                      [class.bg-red-100]="payment.status === 'failed'"
                      [class.text-red-700]="payment.status === 'failed'"
                      [class.bg-yellow-100]="payment.status === 'pending'"
                      [class.text-yellow-700]="payment.status === 'pending'"
                      [class.bg-gray-100]="payment.status === 'refunded'"
                      [class.text-gray-700]="payment.status === 'refunded'"
                    >
                      {{ payment.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right font-medium text-gray-900">
                    {{ '$' + payment.amount.toFixed(2) }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center gap-3">
                      <svg
                        class="h-12 w-12 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                        />
                      </svg>
                      <p>No payment history yet</p>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsComponent implements OnInit {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly authService = inject(AuthService);

  protected readonly payments = this.subscriptionService.payments;

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.subscriptionService.loadPaymentHistory(user.id);
    }
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }
}
