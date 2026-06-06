# BIMBEL ONE PLATFORM — TESTING DOCUMENTATION

**Last Updated:** 2026-06-06
**Test Framework:** Vitest 4.1.8
**Total Tests:** 51 across 7 test files
**Coverage:** Server logic, validation schemas, rate limiting, utilities

---

## Table of Contents

1. [Test Infrastructure](#1-test-infrastructure)
2. [Test Configuration](#2-test-configuration)
3. [Test Suites](#3-test-suites)
4. [Running Tests](#4-running-tests)
5. [Test Patterns & Conventions](#5-test-patterns--conventions)
6. [Coverage Matrix](#6-coverage-matrix)
7. [Writing New Tests](#7-writing-new-tests)
8. [CI/CD Integration](#8-cicd-integration)

---

## 1. Test Infrastructure

### 1.1 Technology Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| Vitest | 4.1.8 | Test runner & assertion library |
| @vitejs/plugin-react | 6.0.2 | React component transformation |
| TypeScript | 5.7 | Type-safe tests |
| Zod 4 | 4.4.3 | Schema validation testing |

### 1.2 File Structure

```
src/
├── lib/
│   ├── __tests__/
│   │   ├── join-classes.test.ts      (4 tests)
│   │   ├── rate-limiter.test.ts      (4 tests) [NEW]
│   │   └── validation.test.ts        (10 tests) [NEW]
│   ├── join-classes.ts
│   ├── rate-limiter.ts
│   └── validation/
│       ├── middleware.ts
│       └── schemas.ts
└── server/
    ├── __tests__/
    │   ├── api.test.ts               (5 tests)
    │   ├── auth.test.ts              (12 tests) [+1 NEW]
    │   ├── password.test.ts          (6 tests)
    │   └── rbac.test.ts              (10 tests)
    ├── api.ts
    ├── auth.ts
    ├── password.ts
    └── rbac.ts
```

### 1.3 Test Naming Convention

- Test files: `<module-name>.test.ts` (co-located with source)
- Test suites: `describe('<module-name>')` matching the module
- Test cases: `it('<action> <condition> <expected result>')`
- Example: `it('finds user by email (case insensitive)')`

---

## 2. Test Configuration

### 2.1 Vitest Config (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### 2.2 Path Aliases

The `@/` prefix resolves to `src/` via both `tsconfig.json` and `vitest.config.ts`:

```typescript
import { checkRateLimit } from '@/lib/rate-limiter';
import { authenticateLogin } from '@/server/auth';
```

### 2.3 Test Environment

- **Environment:** `node` (not jsdom) — server-side tests don't need DOM
- **Globals:** `true` — `describe`, `it`, `expect`, `vi` available without imports
- **Transform:** Vite handles TypeScript and JSX transformation

---

## 3. Test Suites

### 3.1 API Envelope Tests (`src/server/__tests__/api.test.ts`)

**Purpose:** Verify the `ok()` and `fail()` API response envelope helpers.

**Tests (5):**

| Test | Input | Expected |
|------|-------|----------|
| `ok returns success with data` | `ok({ id: '1', name: 'test' })` | `{ success: true, data: { id: '1', name: 'test' } }` |
| `ok returns success with primitive data` | `ok('hello')` | `{ success: true, data: 'hello' }` |
| `fail returns error with message and code` | `fail('Not found', 'not_found')` | `{ success: false, error: { message: 'Not found', code: 'not_found' } }` |
| `fail returns error with details` | `fail('Validation failed', 'validation_error', { field: 'email' })` | `error.details` equals `{ field: 'email' }` |
| `fail returns error without optional fields` | `fail('Something went wrong')` | `error.code` and `error.details` are `undefined` |

**Coverage:**
- All `ok()` code paths (object data, primitive data)
- All `fail()` code paths (with code, with details, without optional fields)

---

### 3.2 Auth Tests (`src/server/__tests__/auth.test.ts`)

**Purpose:** Verify authentication logic — user lookup, branch lookup, sanitization, and login flow.

**Tests (12):**

| # | Test | Area | Description |
|---|------|------|-------------|
| 1 | `finds user by email (case insensitive)` | findUserByIdentifier | `'ADMIN@BIMBEL.ONE'` finds `'admin@bimbel.one'` |
| 2 | `finds user by phone` | findUserByIdentifier | Exact phone match |
| 3 | `finds user by phone with leading/trailing whitespace` | findUserByIdentifier | `'  +62 811 1111 111  '` finds user [NEW] |
| 4 | `returns undefined for unknown identifier` | findUserByIdentifier | Unknown email returns `undefined` |
| 5 | `finds branch by code (case insensitive)` | findBranchByCode | `'hq-01'` finds `'HQ-01'` |
| 6 | `returns undefined for unknown code` | findBranchByCode | Unknown code returns `undefined` |
| 7 | `removes passwordHash from user record` | sanitizeUser | Output has no `passwordHash` property |
| 8 | `returns failure for unknown identifier` | authenticateLogin | Unknown user → `invalid_credentials` |
| 9 | `returns failure for wrong password` | authenticateLogin | Wrong password → `invalid_credentials` |
| 10 | `returns success for valid super_admin credentials` | authenticateLogin | Correct credentials → success with session |
| 11 | `returns success for valid tutor credentials with branch code` | authenticateLogin | Tutor + branch code → correct branch |
| 12 | `returns branch_mismatch when branch does not match user` | authenticateLogin | Tutor + wrong branch → `branch_mismatch` |

**Coverage:**
- Email lookup: case-insensitive matching
- Phone lookup: exact match, whitespace trimming
- Branch lookup: case-insensitive matching
- Login flow: unknown user, wrong password, success, branch mismatch
- Session: role codes and permissions included in response

**Edge Cases NOT Covered:**
- Phone lookup with different formatting (e.g., `+6281111111111` vs `+62 811 1111 111`)
- Multiple role codes for a single user
- Session expiration validation

---

### 3.3 Password Tests (`src/server/__tests__/password.test.ts`)

**Purpose:** Verify password hashing and verification using scrypt.

**Tests (6):**

| # | Test | Description |
|---|------|-------------|
| 1 | `hashPassword returns salt:hash format` | Output contains `:`, salt is 32 hex chars, hash is 128 hex chars |
| 2 | `verifyPassword returns true for correct password` | Hash then verify → `true` |
| 3 | `verifyPassword returns false for incorrect password` | Hash then verify wrong → `false` |
| 4 | `verifyPassword returns false for malformed stored hash` | `'invalid-hash'`, `''`, `'onlysalt'` all return `false` |
| 5 | `different passwords produce different hashes` | Two different passwords → different hashes |
| 6 | `same password produces different hashes each time (different salt)` | Same password twice → different hashes (random salt) |

**Coverage:**
- Hash format validation (salt:hash)
- Correct password verification
- Incorrect password rejection
- Malformed hash handling (3 variants)
- Salt randomness (different hashes for same password)

**Note:** Tests use `hashPassword` (sync) not `hashPasswordAsync` (async). Both functions exist in the codebase.

---

### 3.4 RBAC Tests (`src/server/__tests__/rbac.test.ts`)

**Purpose:** Verify role-based access control — role lookup, permission resolution, and permission checking.

**Tests (10):**

| # | Test | Area | Description |
|---|------|------|-------------|
| 1 | `returns role for valid code` | getRole | `'super_admin'` returns role object |
| 2 | `returns undefined for invalid code` | getRole | `'nonexistent'` returns `undefined` |
| 3 | `returns all permissions for super_admin` | getPermissionsForRoleCodes | Contains `auth:manage`, `branches:manage`, `students:manage` |
| 4 | `returns aggregate permissions for multiple roles` | getPermissionsForRoleCodes | `['tutor', 'parent']` aggregates permissions |
| 5 | `returns sorted permissions` | getPermissionsForRoleCodes | Output is lexicographically sorted |
| 6 | `returns empty array for unknown role codes` | getPermissionsForRoleCodes | `['unknown']` returns `[]` |
| 7 | `returns true when role has permission` | hasPermission | `super_admin` has `auth:manage` |
| 8 | `returns false when role lacks permission` | hasPermission | `tutor` does not have `billing:manage` |
| 9 | `returns true when any role has permission` | hasPermission | `['tutor', 'finance']` has `billing:manage` via finance |
| 10 | `returns all unique permissions sorted` | listAllPermissions | Returns all permissions from all roles, sorted |

**Coverage:**
- Single role lookup (valid + invalid)
- Permission resolution (single role, multiple roles, unknown roles)
- Permission checking (has, doesn't have, aggregated)
- Permission listing (all unique, sorted)

---

### 3.5 Join Classes Tests (`src/lib/__tests__/join-classes.test.ts`)

**Purpose:** Verify the CSS class joining utility function.

**Tests (4):**

| # | Test | Input | Expected |
|---|------|-------|----------|
| 1 | `joins multiple classes with space` | `'foo', 'bar', 'baz'` | `'foo bar baz'` |
| 2 | `filters out falsy values` | `'a', false, 'b', null, 'c', undefined` | `'a b c'` |
| 3 | `returns empty string for no arguments` | (none) | `''` |
| 4 | `returns empty string for all falsy` | `false, null, undefined` | `''` |

**Coverage:**
- Multiple string joining
- Falsy value filtering (false, null, undefined)
- Empty input handling

---

### 3.6 Rate Limiter Tests (`src/lib/__tests__/rate-limiter.test.ts`) [NEW]

**Purpose:** Verify rate limiting behavior — request counting, blocking, window reset, and memory cleanup.

**Tests (4):**

| # | Test | Description | Key Assertions |
|---|------|-------------|----------------|
| 1 | `allows requests within limit` | First request for a key | `allowed: true`, `remaining: 9` |
| 2 | `blocks requests over limit` | 11th request for same key | `allowed: false`, `remaining: 0` |
| 3 | `resets after window expires` | Request after 61s window | `allowed: true`, `remaining: 9` |
| 4 | `cleans up expired entries when map grows past threshold` | 101 unique keys, all expired, then new request | Map size drops from 101 to 1 |

**Test Setup:**
```typescript
beforeEach(() => {
  vi.useFakeTimers();    // Control time
  __resetRateLimiter();  // Clear shared Map between tests
});

afterEach(() => {
  vi.useRealTimers();    // Restore real timers
});
```

**Coverage:**
- Request allowance within limit
- Request blocking at limit boundary
- Window expiration and counter reset
- Memory cleanup of expired entries (prevents memory leak)

**Internal Test Helpers:**
- `__getRequestCountSize()` — Returns current size of internal Map (testing only)
- `__resetRateLimiter()` — Clears all entries from internal Map (testing only)

---

### 3.7 Validation Schema Tests (`src/lib/__tests__/validation.test.ts`) [NEW]

**Purpose:** Verify Zod validation schemas accept valid inputs and reject invalid ones.

**Tests (10):**

| # | Test | Schema | Input | Expected |
|---|------|--------|-------|----------|
| 1 | `accepts valid branchId slug format` | auditLogQuerySchema | `{ branchId: 'branch-pusat' }` | `success: true` |
| 2 | `accepts UUID format branchId` | auditLogQuerySchema | `{ branchId: '550e8400-e29b-...' }` | `success: true` |
| 3 | `accepts empty query` | auditLogQuerySchema | `{}` | `success: true` |
| 4 | `accepts undefined branchId` | auditLogQuerySchema | `{ branchId: undefined }` | `success: true` |
| 5 | `rejects non-string branchId` | auditLogQuerySchema | `{ branchId: 123 }` | `success: false` |
| 6 | `accepts valid login input` | loginSchema | `{ identifier: 'admin@...', password: 'Admin123!' }` | `success: true` |
| 7 | `rejects empty identifier` | loginSchema | `{ identifier: '', password: '...' }` | `success: false` |
| 8 | `rejects empty password` | loginSchema | `{ identifier: '...', password: '' }` | `success: false` |
| 9 | `accepts optional branchCode` | loginSchema | `{ ..., branchCode: 'HQ-01' }` | `success: true` |
| 10 | `rejects empty string branchCode` | loginSchema | `{ ..., branchCode: '' }` | `success: false` |

**Coverage:**
- auditLogQuerySchema: slug IDs, UUIDs, empty, undefined, wrong type
- loginSchema: valid input, empty fields, optional branchCode, empty branchCode

---

## 4. Running Tests

### 4.1 Commands

```bash
# Run all tests (single run)
npm test
# or
npx vitest run

# Run with verbose output
npx vitest run -v
# or
npx vitest run --reporter=verbose

# Run specific test file
npx vitest run src/server/__tests__/auth.test.ts

# Run specific test by name pattern
npx vitest run -t "finds user by email"

# Watch mode (auto-rerun on file changes)
npm run test:watch
# or
npx vitest

# Run with coverage report
npx vitest run --coverage
```

### 4.2 Expected Output (Clean Run)

```
 RUN  v4.1.8 /Users/felix/Documents/Project Sementara/Bimbel_1.0

 ✓ src/lib/__tests__/join-classes.test.ts (4 tests) 2ms
 ✓ src/lib/__tests__/rate-limiter.test.ts (4 tests) 4ms
 ✓ src/lib/__tests__/validation.test.ts (10 tests) 3ms
 ✓ src/server/__tests__/api.test.ts (5 tests) 3ms
 ✓ src/server/__tests__/rbac.test.ts (10 tests) 3ms
 ✓ src/server/__tests__/auth.test.ts (12 tests) 74ms
 ✓ src/server/__tests__/password.test.ts (6 tests) 226ms

 Test Files  7 passed (7)
      Tests  51 passed (51)
   Duration  386ms
```

### 4.3 Performance Benchmarks

| Metric | Value |
|--------|-------|
| Total test execution | ~386ms |
| Transform time | ~145ms |
| Test code execution | ~313ms |
| Slowest suite | password.test.ts (226ms — scrypt is CPU-intensive) |
| Fastest suite | join-classes.test.ts (2ms) |

---

## 5. Test Patterns & Conventions

### 5.1 Test-Driven Development (TDD) Cycle

All new tests in this project follow the RED-GREEN-REFACTOR cycle:

1. **RED** — Write a failing test that describes the expected behavior
2. **GREEN** — Write the minimal code to make the test pass
3. **REFACTOR** — Clean up the implementation while keeping tests green

### 5.2 Test Isolation

- Each test file uses `beforeEach` to reset shared state
- Rate limiter tests use `__resetRateLimiter()` to clear the module-level Map
- Fake timers (`vi.useFakeTimers()`) are used for time-dependent tests
- No test depends on the execution order of other tests

### 5.3 Assertion Style

Use Vitest's built-in `expect` with descriptive matchers:

```typescript
// Equality
expect(result.success).toBe(true);
expect(result.data).toEqual({ id: '1', name: 'test' });

// Truthiness
expect(user).toBeDefined();
expect(user).toBeUndefined();

// Type checking
expect(result.error?.code).toBeUndefined();

// String matching
expect(result).toContain(':');

// Length
expect(salt).toHaveLength(32);

// Comparison
expect(permissions[i] >= permissions[i - 1]).toBe(true);
```

### 5.4 Naming Conventions

```typescript
// Suite name = module name
describe('rate limiter', () => {
  // Test name = action + condition + expected result
  it('cleans up expired entries when map grows past threshold', () => {
    // Arrange
    for (let i = 0; i < 101; i++) {
      checkRateLimit(`flood-key-${i}`);
    }

    // Act
    vi.advanceTimersByTime(61_000);
    checkRateLimit('new-key-after-cleanup');

    // Assert
    expect(__getRequestCountSize()).toBe(1);
  });
});
```

### 5.5 Shared State Management

For modules with shared mutable state (like the rate limiter Map), expose internal helpers for testing:

```typescript
/** @internal — exposed for testing only */
export function __resetRateLimiter(): void {
  requestCounts.clear();
}

/** @internal — exposed for testing only */
export function __getRequestCountSize(): number {
  return requestCounts.size;
}
```

These functions are marked `@internal` and should not be used in production code.

---

## 6. Coverage Matrix

### 6.1 Source File → Test File Mapping

| Source File | Test File | Tests | Status |
|-------------|-----------|-------|--------|
| `src/server/api.ts` | `src/server/__tests__/api.test.ts` | 5 | COVERED |
| `src/server/auth.ts` | `src/server/__tests__/auth.test.ts` | 12 | COVERED |
| `src/server/password.ts` | `src/server/__tests__/password.test.ts` | 6 | COVERED |
| `src/server/rbac.ts` | `src/server/__tests__/rbac.test.ts` | 10 | COVERED |
| `src/lib/join-classes.ts` | `src/lib/__tests__/join-classes.test.ts` | 4 | COVERED |
| `src/lib/rate-limiter.ts` | `src/lib/__tests__/rate-limiter.test.ts` | 4 | COVERED |
| `src/lib/validation/schemas.ts` | `src/lib/__tests__/validation.test.ts` | 10 | COVERED |
| `src/server/catalog.ts` | — | 0 | NOT TESTED |
| `src/server/audit-store.ts` | — | 0 | NOT TESTED |
| `src/lib/validation/middleware.ts` | — | 0 | NOT TESTED |
| `src/lib/stores/auth-store.ts` | — | 0 | NOT TESTED |
| `src/lib/screens.ts` | — | 0 | NOT TESTED |
| `src/lib/branch-directory.ts` | — | 0 | NOT TESTED |
| `src/app/api/v1/*/route.ts` (7 files) | — | 0 | NOT TESTED |
| `src/components/**/*.tsx` (20+ files) | — | 0 | NOT TESTED |

### 6.2 Functional Coverage

| Feature | Unit Tests | Integration Tests | E2E Tests |
|---------|------------|-------------------|-----------|
| Password hashing | YES | NO | NO |
| User authentication | YES | NO | NO |
| RBAC / Permissions | YES | NO | NO |
| Rate limiting | YES | NO | NO |
| Input validation | YES | NO | NO |
| API routes | NO | NO | NO |
| Client state (Zustand) | NO | NO | NO |
| UI components | NO | NO | NO |
| Audit logging | NO | NO | NO |

---

## 7. Writing New Tests

### 7.1 Template for Server Logic Tests

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { functionToTest } from '@/server/module';

describe('module name', () => {
  describe('functionName', () => {
    // Setup if needed
    beforeEach(() => {
      // Reset state, mock dependencies
    });

    afterEach(() => {
      // Cleanup
    });

    it('does X when Y', () => {
      // Arrange
      const input = { ... };

      // Act
      const result = functionToTest(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('handles edge case Z', () => {
      // Test boundary conditions, error cases, etc.
    });
  });
});
```

### 7.2 Template for Validation Schema Tests

```typescript
import { describe, it, expect } from 'vitest';
import { schemaName } from '@/lib/validation/schemas';

describe('schema name', () => {
  it('accepts valid input', () => {
    const result = schemaName.safeParse({ /* valid data */ });
    expect(result.success).toBe(true);
  });

  it('rejects invalid input', () => {
    const result = schemaName.safeParse({ /* invalid data */ });
    expect(result.success).toBe(false);
  });
});
```

### 7.3 Checklist for New Tests

- [ ] Test file named `<module>.test.ts` next to source file
- [ ] `describe` block matches module name
- [ ] `it` block describes behavior in plain language
- [ ] Tests cover happy path AND error cases
- [ ] Tests are isolated (no shared state between tests)
- [ ] `beforeEach`/`afterEach` used for setup/teardown
- [ ] All assertions use descriptive matchers
- [ ] Test passes with `npx vitest run <file>`
- [ ] Full suite still passes with `npx vitest run`

---

## 8. CI/CD Integration

### 8.1 Pre-commit Checklist

Before committing code, run:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
npx eslint .

# 3. Test
npx vitest run

# 4. Build (optional, for critical changes)
npx next build
```

### 8.2 Recommended CI Pipeline

```yaml
# .github/workflows/test.yml (recommended)
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npx eslint .
      - run: npx vitest run --coverage
      - run: npx next build
```

### 8.3 Test Failure Protocol

1. **Do not merge** if any test fails
2. **Investigate** — is the test wrong or the code wrong?
3. **Fix the root cause** — never disable tests to make them pass
4. **Verify** — run full suite after fix
5. **Document** — update this file if test patterns change

---

## Appendix A: Test Result History

| Date | Commit | Tests | Notes |
|------|--------|-------|-------|
| 2026-06-04 | `9fd9947` | 0 | Initial commit, no tests |
| 2026-06-05 | `60cf2f6` | 36 | Added core test suites |
| 2026-06-05 | `e789ec3` | 36 | Added rate limiter, no tests yet |
| 2026-06-05 | `4f2042f` | 36 | Refactored auth, tests still pass |
| 2026-06-06 | `93864a1` | 40 | +4 rate limiter tests |
| 2026-06-06 | `1ffb6d2` | 49 | +9 validation tests |
| 2026-06-06 | `8a3408f` | 50 | +1 auth test |
| 2026-06-06 | `5a13f86` | 51 | +1 validation test |
| 2026-06-06 | `0d75d49` | 51 | Build fix, no test changes |

---

*End of Testing Documentation*
*Generated: 2026-06-06T21:00:00+07:00*
