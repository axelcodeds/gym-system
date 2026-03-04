import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500">{{ label() }}</p>
          <p class="mt-2 text-3xl font-bold text-gray-900">{{ value() }}</p>
          @if (change()) {
            <p
              class="mt-1 text-sm"
              [class.text-green-600]="changeType() === 'positive'"
              [class.text-red-600]="changeType() === 'negative'"
              [class.text-gray-500]="changeType() === 'neutral'"
            >
              {{ change() }}
            </p>
          }
        </div>
        <div
          class="h-12 w-12 rounded-lg flex items-center justify-center"
          [class.bg-indigo-100]="iconColor() === 'indigo'"
          [class.bg-green-100]="iconColor() === 'green'"
          [class.bg-orange-100]="iconColor() === 'orange'"
          [class.bg-red-100]="iconColor() === 'red'"
          [class.bg-blue-100]="iconColor() === 'blue'"
        >
          <span
            [innerHTML]="icon()"
            class="w-6 h-6"
            [class.text-indigo-600]="iconColor() === 'indigo'"
            [class.text-green-600]="iconColor() === 'green'"
            [class.text-orange-600]="iconColor() === 'orange'"
            [class.text-red-600]="iconColor() === 'red'"
            [class.text-blue-600]="iconColor() === 'blue'"
          ></span>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input<string>('');
  readonly iconColor = input<'indigo' | 'green' | 'orange' | 'red' | 'blue'>(
    'indigo'
  );
  readonly change = input<string>('');
  readonly changeType = input<'positive' | 'negative' | 'neutral'>('neutral');
}
