export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'member';
  avatarUrl?: string;
  createdAt: Date;
}

export interface Member extends User {
  membershipId?: string;
  membershipStatus: 'active' | 'inactive' | 'expired';
  joinDate: Date;
}
