import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin-layout.component').then(
        (m) => m.AdminLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'members',
        loadComponent: () =>
          import('./features/admin/members/members.component').then(
            (m) => m.MembersComponent
          ),
      },
      {
        path: 'subscriptions',
        loadComponent: () =>
          import('./features/admin/subscriptions/subscriptions.component').then(
            (m) => m.AdminSubscriptionsComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
    ],
  },
  {
    path: 'member',
    loadComponent: () =>
      import('./features/member/member-layout.component').then(
        (m) => m.MemberLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/member/membership/membership.component').then(
            (m) => m.MembershipComponent
          ),
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import('./features/member/subscription/subscription.component').then(
            (m) => m.SubscriptionComponent
          ),
      },
      {
        path: 'plans',
        loadComponent: () =>
          import('./features/member/plans/plans.component').then(
            (m) => m.PlansComponent
          ),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/member/payments/payments.component').then(
            (m) => m.PaymentsComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/member/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
