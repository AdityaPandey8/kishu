

# Allow Any Credentials for Admin Login (Dev Mode)

## Change

**File: `src/pages/auth/AdminLogin.tsx`**

Modify `handleSubmit` to skip credential validation and always log in as admin. Instead of checking if the result user's role is admin, force the role to admin regardless of email.

**File: `src/contexts/AuthContext.tsx`**

In the `login` function, no changes needed — the AdminLogin page will simply not check the role anymore and will force-set the role to admin after login.

Specifically in `AdminLogin.tsx`:
- Remove the role check (`if (result.user?.role !== 'admin')`) 
- After login, call `updateUser({ role: 'admin' })` to ensure the logged-in user gets admin access regardless of email

This is a ~5 line edit in one file.

