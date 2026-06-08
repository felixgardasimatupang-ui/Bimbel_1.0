import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore, type AuthenticatedUser } from '@/lib/stores/auth-store';

const mockUser: AuthenticatedUser = {
  id: 'user-test',
  fullName: 'Test User',
  email: 'test@bimbel.one',
  phone: '+62 800 0000 000',
  branchId: 'branch-pusat',
  branchName: 'Bimbel One Head Office',
  branchCode: 'HQ-01',
  roleCodes: ['super_admin'],
  permissions: ['auth:manage', 'branches:manage', 'students:manage']
};

const mockSessionId = 'session-test-123';

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      sessionId: null,
      isAuthenticated: false
    });
  });

  it('starts with unauthenticated state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.sessionId).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('login sets user, sessionId, and isAuthenticated', () => {
    const { login } = useAuthStore.getState();
    login(mockUser, mockSessionId);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.sessionId).toBe(mockSessionId);
    expect(state.isAuthenticated).toBe(true);
  });

  it('logout clears user, sessionId, and isAuthenticated', () => {
    const { login, logout } = useAuthStore.getState();
    login(mockUser, mockSessionId);
    logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.sessionId).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('hasPermission returns true when user has permission', () => {
    const { login, hasPermission } = useAuthStore.getState();
    login(mockUser, mockSessionId);

    expect(useAuthStore.getState().hasPermission('auth:manage')).toBe(true);
    expect(useAuthStore.getState().hasPermission('branches:manage')).toBe(true);
  });

  it('hasPermission returns false when user lacks permission', () => {
    const { login, hasPermission } = useAuthStore.getState();
    login(mockUser, mockSessionId);

    expect(hasPermission('billing:manage')).toBe(false);
  });

  it('hasPermission returns false when no user is logged in', () => {
    const { hasPermission } = useAuthStore.getState();
    expect(hasPermission('auth:manage')).toBe(false);
  });

  it('hasRole returns true when user has role', () => {
    const { login, hasRole } = useAuthStore.getState();
    login(mockUser, mockSessionId);

    expect(hasRole('super_admin')).toBe(true);
  });

  it('hasRole returns false when user lacks role', () => {
    const { login, hasRole } = useAuthStore.getState();
    login(mockUser, mockSessionId);

    expect(hasRole('tutor')).toBe(false);
  });

  it('hasRole returns false when no user is logged in', () => {
    const { hasRole } = useAuthStore.getState();
    expect(hasRole('super_admin')).toBe(false);
  });
});
