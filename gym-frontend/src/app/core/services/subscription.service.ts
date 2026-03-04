import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubscriptionPlan, Subscription, PaymentHistory } from '../models/subscription.model';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface BackendPlan {
  id: string;
  name: string;
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  price: number;
  currency: string;
  features: string[];
  popular: boolean;
}

interface BackendSubscription {
  id: string;
  memberId: string;
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  price: number;
  autoRenew: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly subscriptionsUrl = `${environment.apiUrl}/subscriptions`;
  private readonly plansUrl = `${environment.apiUrl}/plans`;

  private readonly plans = signal<SubscriptionPlan[]>([]);
  private readonly currentSubscription = signal<Subscription | null>(null);
  private readonly paymentHistory = signal<PaymentHistory[]>([]);
  private readonly loading = signal(false);

  readonly availablePlans = this.plans.asReadonly();
  readonly subscription = this.currentSubscription.asReadonly();
  readonly payments = this.paymentHistory.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  readonly weeklyPlans = computed(() => this.plans().filter((p) => p.period === 'weekly'));
  readonly monthlyPlans = computed(() => this.plans().filter((p) => p.period === 'monthly'));
  readonly yearlyPlans = computed(() => this.plans().filter((p) => p.period === 'yearly'));

  async loadPlans(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(this.http.get<BackendPlan[]>(this.plansUrl));
      const plans = response.map((p) => this.mapBackendPlan(p));
      this.plans.set(plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadCurrentSubscription(memberId: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<BackendSubscription>(`${this.subscriptionsUrl}/member/${memberId}/active`),
      );
      const plan = this.plans().find((p) => p.id === response.planId);
      if (response && plan) {
        this.currentSubscription.set(this.mapBackendSubscription(response, plan));
      }
    } catch (error) {
      // No active subscription
      this.currentSubscription.set(null);
    }
  }

  async loadPaymentHistory(memberId: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<PaymentHistory[]>(`${environment.apiUrl}/payments/member/${memberId}`),
      );
      this.paymentHistory.set(
        response.map((p) => ({
          ...p,
          date: new Date(p.date),
        })),
      );
    } catch (error) {
      console.error('Failed to load payment history:', error);
    }
  }

  async selectPlan(planId: string, memberId: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<BackendSubscription>(this.subscriptionsUrl, {
          memberId,
          planId,
        }),
      );
      const plan = this.plans().find((p) => p.id === planId);
      if (plan) {
        this.currentSubscription.set(this.mapBackendSubscription(response, plan));
      }
      return true;
    } catch (error) {
      console.error('Failed to select plan:', error);
      return false;
    }
  }

  async cancelSubscription(): Promise<boolean> {
    const current = this.currentSubscription();
    if (!current) return false;

    try {
      await firstValueFrom(
        this.http.post<BackendSubscription>(`${this.subscriptionsUrl}/${current.id}/cancel`, {}),
      );
      this.currentSubscription.set({
        ...current,
        status: 'cancelled',
        autoRenew: false,
      });
      return true;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }

  toggleAutoRenew(): void {
    const current = this.currentSubscription();
    if (current) {
      this.currentSubscription.set({
        ...current,
        autoRenew: !current.autoRenew,
      });
    }
  }

  private mapBackendPlan(plan: BackendPlan): SubscriptionPlan {
    return {
      id: plan.id,
      name: plan.name,
      period: plan.period.toLowerCase() as 'weekly' | 'monthly' | 'yearly',
      price: plan.price,
      currency: plan.currency,
      features: plan.features ?? [],
      popular: plan.popular,
    };
  }

  private mapBackendSubscription(sub: BackendSubscription, plan: SubscriptionPlan): Subscription {
    return {
      id: sub.id,
      memberId: sub.memberId,
      planId: sub.planId,
      plan,
      status: sub.status.toLowerCase() as 'active' | 'cancelled' | 'expired' | 'pending',
      startDate: new Date(sub.startDate),
      endDate: new Date(sub.endDate),
      autoRenew: sub.autoRenew,
    };
  }
}
