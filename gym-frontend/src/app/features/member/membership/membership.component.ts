import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionService } from '../../../core/services/subscription.service';
import { Member } from '../../../core/models/user.model';

@Component({
  selector: 'app-membership',
  imports: [RouterLink, TitleCasePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">My Membership</h1>
        <p class="text-gray-500 mt-1">View and manage your gym membership</p>
      </div>

      <!-- Membership Card -->
      <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 text-white">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p class="text-indigo-200 text-sm font-medium">MEMBER</p>
            <h2 class="text-3xl font-bold mt-1">{{ memberName() }}</h2>
            <p class="text-indigo-200 mt-2">{{ memberEmail() }}</p>
          </div>
          <div class="text-right">
            <span
              class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold"
              [class.bg-green-400]="memberStatus() === 'active'"
              [class.text-green-900]="memberStatus() === 'active'"
              [class.bg-orange-400]="memberStatus() === 'expired'"
              [class.text-orange-900]="memberStatus() === 'expired'"
              [class.bg-gray-400]="memberStatus() === 'inactive'"
              [class.text-gray-900]="memberStatus() === 'inactive'"
            >
              {{ memberStatus() | titlecase }}
            </span>
            <p class="text-indigo-200 text-sm mt-2">Member since {{ memberSince() }}</p>
          </div>
        </div>

        <!-- Current Plan Info -->
        @if (subscription(); as sub) {
          <div class="mt-8 pt-6 border-t border-white/20">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p class="text-indigo-200 text-sm">Current Plan</p>
                <p class="text-xl font-semibold mt-1">{{ sub.plan.name }}</p>
              </div>
              <div>
                <p class="text-indigo-200 text-sm">Renewal Date</p>
                <p class="text-xl font-semibold mt-1">{{ formatDate(sub.endDate) }}</p>
              </div>
              <div>
                <p class="text-indigo-200 text-sm">Monthly Price</p>
                <p class="text-xl font-semibold mt-1">{{ '$' + sub.plan.price }}/{{ sub.plan.period }}</p>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Days Remaining</p>
              <p class="text-2xl font-bold text-gray-900">{{ daysRemaining() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Check-ins This Month</p>
              <p class="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center gap-4">
            <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Classes Attended</p>
              <p class="text-2xl font-bold text-gray-900">7</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Plan Features -->
      @if (subscription(); as sub) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Your Plan Benefits</h3>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (feature of sub.plan.features; track feature) {
              <li class="flex items-center gap-3">
                <svg class="h-5 w-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span class="text-gray-700">{{ feature }}</span>
              </li>
            }
          </ul>
          <div class="mt-6 flex flex-wrap gap-4">
            <a
              routerLink="/member/plans"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Upgrade Plan
            </a>
            <a
              routerLink="/member/subscription"
              class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Manage Subscription
            </a>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembershipComponent {
  private readonly authService = inject(AuthService);
  private readonly subscriptionService = inject(SubscriptionService);

  protected readonly subscription = this.subscriptionService.subscription;

  protected readonly memberName = computed(() => {
    const user = this.authService.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Member';
  });

  protected readonly memberEmail = computed(
    () => this.authService.user()?.email ?? ''
  );

  protected readonly memberStatus = computed(() => {
    const user = this.authService.user();
    return (user as Member)?.membershipStatus ?? 'active';
  });

  protected readonly memberSince = computed(() => {
    const user = this.authService.user() as Member;
    if (user?.joinDate) {
      return this.formatDate(user.joinDate);
    }
    return 'N/A';
  });

  protected readonly daysRemaining = computed(() => {
    const sub = this.subscription();
    if (sub) {
      const now = new Date();
      const end = new Date(sub.endDate);
      const diff = Math.ceil(
        (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return Math.max(0, diff);
    }
    return 0;
  });

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  }
}
