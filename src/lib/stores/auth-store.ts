import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthenticatedUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  branchId: string;
  branchName: string;
  branchCode: string;
  roleCodes: string[];
  permissions: string[];
};

export type AuthState = {
  user: AuthenticatedUser | null;
  sessionId: string | null;
  isAuthenticated: boolean;

  login: (user: AuthenticatedUser, sessionId: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionId: null,
      isAuthenticated: false,

      login: (user, sessionId) =>
        set({ user, sessionId, isAuthenticated: true }),

      logout: () =>
        set({ user: null, sessionId: null, isAuthenticated: false }),

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        return user.permissions.includes(permission);
      },

      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        return user.roleCodes.includes(role);
      },
    }),
    {
      name: 'bimbel-auth',
      partialize: (state) => ({
        user: state.user,
        sessionId: state.sessionId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
