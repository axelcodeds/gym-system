import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Member } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  inactiveMembers: number;
  activeSubscriptions: number;
  totalRevenue: number;
}

interface CreateMemberRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface UpdateMemberRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  membershipStatus?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/members`;

  private readonly members = signal<Member[]>([]);
  private readonly stats = signal<DashboardStats | null>(null);
  private readonly loading = signal(false);

  readonly allMembers = this.members.asReadonly();
  readonly dashboardStats = this.stats.asReadonly();
  readonly isLoading = this.loading.asReadonly();

  readonly totalMembers = computed(() => this.stats()?.totalMembers ?? this.members().length);
  readonly activeMembers = computed(
    () =>
      this.stats()?.activeMembers ??
      this.members().filter((m) => m.membershipStatus === 'active').length,
  );
  readonly expiredMembers = computed(
    () =>
      this.stats()?.expiredMembers ??
      this.members().filter((m) => m.membershipStatus === 'expired').length,
  );
  readonly inactiveMembers = computed(
    () =>
      this.stats()?.inactiveMembers ??
      this.members().filter((m) => m.membershipStatus === 'inactive').length,
  );

  async loadMembers(): Promise<void> {
    this.loading.set(true);
    try {
      const response = await firstValueFrom(this.http.get<Member[]>(this.apiUrl));
      // Map backend format to frontend format
      const members = response.map((m) => this.mapMemberResponse(m));
      this.members.set(members);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadDashboardStats(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`),
      );
      this.stats.set(response);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  }

  getMemberById(id: string): Member | undefined {
    return this.members().find((m) => m.id === id);
  }

  async getMemberByIdFromApi(id: string): Promise<Member | null> {
    try {
      const response = await firstValueFrom(this.http.get<Member>(`${this.apiUrl}/${id}`));
      return this.mapMemberResponse(response);
    } catch (error) {
      console.error('Failed to get member:', error);
      return null;
    }
  }

  async searchMembers(query: string): Promise<Member[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<Member[]>(`${this.apiUrl}/search`, { params: { query } }),
      );
      return response.map((m) => this.mapMemberResponse(m));
    } catch (error) {
      console.error('Failed to search members:', error);
      return [];
    }
  }

  async addMember(member: CreateMemberRequest): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.post<Member>(this.apiUrl, member));
      const newMember = this.mapMemberResponse(response);
      this.members.update((members) => [...members, newMember]);
      return true;
    } catch (error) {
      console.error('Failed to add member:', error);
      return false;
    }
  }

  async updateMember(id: string, updates: UpdateMemberRequest): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.http.put<Member>(`${this.apiUrl}/${id}`, updates));
      const updatedMember = this.mapMemberResponse(response);
      this.members.update((members) => members.map((m) => (m.id === id ? updatedMember : m)));
      return true;
    } catch (error) {
      console.error('Failed to update member:', error);
      return false;
    }
  }

  async deleteMember(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
      this.members.update((members) => members.filter((m) => m.id !== id));
      return true;
    } catch (error) {
      console.error('Failed to delete member:', error);
      return false;
    }
  }

  private mapMemberResponse(member: Member): Member {
    return {
      ...member,
      role: 'member',
      membershipStatus: (member.membershipStatus?.toLowerCase() ?? 'inactive') as
        | 'active'
        | 'inactive'
        | 'expired',
      joinDate: member.joinDate ? new Date(member.joinDate) : new Date(),
      createdAt: member.createdAt ? new Date(member.createdAt) : new Date(),
    };
  }
}
