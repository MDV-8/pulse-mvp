# Task 2 — Auth Flow Implementation

## Agent: full-stack-developer
## Status: Completed

### Files Modified
1. **src/stores/app-store.ts** — Added `'auth'` to AppMode, added `userEmail`, `userName`, `isLoggedIn`, `isFirstTime` fields, `login()` and `logout()` actions, changed default mode to `'auth'`, persisted auth fields.
2. **src/app/page.tsx** — Imported `AuthScreen` and added `{appMode === 'auth' && <AuthScreen />}` render block before onboarding.
3. **src/components/pulse/auth/auth-screen.tsx** (new) — Full auth screen with Login/Register tabs, mock validation, demo login, and skip auth.

### Key Decisions
- User credentials stored in a separate localStorage key (`pulse-users`) as a JSON array, separate from Zustand's `pulse-storage`.
- `login()` action in the store does NOT set `isFirstTime` — the auth-screen component handles that logic based on the stored user's `isFirstTime` flag and updates the stored user accordingly.
- `logout()` resets auth state and sets `appMode` back to `'auth'`.
- Demo login (demo@pulse.kz / Demo123) goes directly to `'owner'` mode.
- Register always creates account and goes to `'onboarding'`.
- Skip auth goes to `'onboarding'` as guest.

### Lint
- ESLint: 0 errors
