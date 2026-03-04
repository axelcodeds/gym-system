import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { SubscriptionPlan } from '../../core/models/subscription.model';

@Component({
  selector: 'app-plan-card',
  template: `
    <div
      class="relative bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-lg"
      [class.border-indigo-500]="plan().popular"
      [class.border-gray-200]="!plan().popular"
      [class.ring-2]="isSelected()"
      [class.ring-indigo-500]="isSelected()"
    >
      @if (plan().popular) {
        <div
          class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-sm font-semibold px-4 py-1 rounded-full"
        >
          Most Popular
        </div>
      }

      <div class="p-8">
        <h3 class="text-xl font-semibold text-gray-900">{{ plan().name }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ periodLabel() }}</p>

        <div class="mt-6">
          <span class="text-4xl font-bold text-gray-900"
            >{{ plan().currency === 'USD' ? '$' : plan().currency
            }}{{ plan().price }}</span
          >
          <span class="text-gray-500">/{{ plan().period }}</span>
        </div>

        <ul class="mt-8 space-y-4">
          @for (feature of plan().features; track feature) {
            <li class="flex items-start gap-3">
              <svg
                class="h-5 w-5 text-green-500 shrink-0 mt-0.5"
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
              <span class="text-gray-600">{{ feature }}</span>
            </li>
          }
        </ul>

        <button
          type="button"
          class="mt-8 w-full py-3 px-6 rounded-xl font-semibold transition-colors"
          [class.bg-indigo-600]="plan().popular || isSelected()"
          [class.text-white]="plan().popular || isSelected()"
          [class.hover:bg-indigo-700]="plan().popular || isSelected()"
          [class.bg-gray-100]="!plan().popular && !isSelected()"
          [class.text-gray-900]="!plan().popular && !isSelected()"
          [class.hover:bg-gray-200]="!plan().popular && !isSelected()"
          [disabled]="isCurrentPlan()"
          (click)="select.emit(plan())"
        >
          @if (isCurrentPlan()) {
            Current Plan
          } @else if (isSelected()) {
            Selected
          } @else {
            Choose {{ plan().name }}
          }
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanCardComponent {
  readonly plan = input.required<SubscriptionPlan>();
  readonly isSelected = input<boolean>(false);
  readonly isCurrentPlan = input<boolean>(false);
  readonly select = output<SubscriptionPlan>();

  protected readonly periodLabel = computed(() => {
    switch (this.plan().period) {
      case 'weekly':
        return 'Billed weekly';
      case 'monthly':
        return 'Billed monthly';
      case 'yearly':
        return 'Billed annually';
      default:
        return '';
    }
  });
}
