import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { TitleCasePipe, SlicePipe } from '@angular/common';
import { StatCardComponent } from '../../../shared/components/stat-card.component';
import { MemberService } from '../../../core/services/member.service';

@Component({
  selector: 'app-dashboard',
  imports: [StatCardComponent, TitleCasePipe, SlicePipe],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-1">Welcome back! Here's what's happening at your gym.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-stat-card
          label="Total Members"
          [value]="memberService.totalMembers()"
          iconColor="indigo"
          change="+12% from last month"
          changeType="positive"
          [icon]="usersIcon"
        />
        <app-stat-card
          label="Active Members"
          [value]="memberService.activeMembers()"
          iconColor="green"
          change="+8% from last month"
          changeType="positive"
          [icon]="activeIcon"
        />
        <app-stat-card
          label="Expired Memberships"
          [value]="memberService.expiredMembers()"
          iconColor="orange"
          change="-3% from last month"
          changeType="positive"
          [icon]="expiredIcon"
        />
        <app-stat-card
          label="Monthly Revenue"
          value="$12,450"
          iconColor="blue"
          change="+15% from last month"
          changeType="positive"
          [icon]="revenueIcon"
        />
      </div>

      <!-- Recent Activity & Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Members -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Recent Members</h2>
          <div class="space-y-4">
            @for (member of memberService.allMembers() | slice: 0 : 5; track member.id) {
              <div
                class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center"
                  >
                    <span class="text-indigo-600 font-medium text-sm">
                      {{ member.firstName[0] }}{{ member.lastName[0] }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ member.firstName }} {{ member.lastName }}
                    </p>
                    <p class="text-sm text-gray-500">{{ member.email }}</p>
                  </div>
                </div>
                <span
                  class="px-3 py-1 text-xs font-medium rounded-full"
                  [class.bg-green-100]="member.membershipStatus === 'active'"
                  [class.text-green-700]="member.membershipStatus === 'active'"
                  [class.bg-orange-100]="member.membershipStatus === 'expired'"
                  [class.text-orange-700]="member.membershipStatus === 'expired'"
                  [class.bg-gray-100]="member.membershipStatus === 'inactive'"
                  [class.text-gray-700]="member.membershipStatus === 'inactive'"
                >
                  {{ member.membershipStatus | titlecase }}
                </span>
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 gap-4">
            <button
              type="button"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <div class="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                <svg
                  class="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900">Add Member</span>
            </button>

            <button
              type="button"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div class="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <svg
                  class="h-6 w-6 text-green-600"
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
              <span class="text-sm font-medium text-gray-900">New Subscription</span>
            </button>

            <button
              type="button"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div class="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900">Schedule Class</span>
            </button>

            <button
              type="button"
              class="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div class="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg
                  class="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                  />
                </svg>
              </div>
              <span class="text-sm font-medium text-gray-900">View Reports</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Subscription Overview -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Subscription Distribution</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-4 rounded-lg bg-gray-50">
            <p class="text-3xl font-bold text-indigo-600">25</p>
            <p class="text-sm text-gray-500 mt-1">Weekly Plans</p>
          </div>
          <div class="text-center p-4 rounded-lg bg-gray-50">
            <p class="text-3xl font-bold text-green-600">150</p>
            <p class="text-sm text-gray-500 mt-1">Monthly Plans</p>
          </div>
          <div class="text-center p-4 rounded-lg bg-gray-50">
            <p class="text-3xl font-bold text-blue-600">45</p>
            <p class="text-sm text-gray-500 mt-1">Yearly Plans</p>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  protected readonly memberService = inject(MemberService);

  ngOnInit(): void {
    this.memberService.loadMembers();
    this.memberService.loadDashboardStats();
  }

  protected readonly usersIcon = `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>`;
  protected readonly activeIcon = `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
  protected readonly expiredIcon = `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>`;
  protected readonly revenueIcon = `<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
}
