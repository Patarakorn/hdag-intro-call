# Admin Panel Setup

## Environment Variables

To enable admin functionality, you need to set up the following environment variables in your `.env.local` file:

```
# Frontend (Client-side) - must match exactly
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com

# Backend (Server-side) - must match exactly  
ADMIN_EMAIL=your-admin-email@example.com
```

**Important**: Both environment variables must contain the exact same email address. Only users with this specific email will have access to the admin panel.

## Admin Access Logic

The admin panel is accessible only to users whose email exactly matches the `NEXT_PUBLIC_ADMIN_EMAIL` environment variable.

You can modify this logic in:
- `src/components/HomeClient.tsx` (frontend check)
- `src/app/admin/layout.tsx` (backend check)

## Features

The admin panel includes:
- **PDF File Management**: Upload and manage PDF documents
- **Email Database**: Add and manage email addresses for user access
- **Toast Notifications**: Real-time feedback using Sonner toast library
- **Responsive Design**: Works on desktop and mobile devices
- **Shadcn UI Components**: Uses official shadcn/ui table and sonner components

## Security

- Admin access is protected by authentication middleware
- Only authenticated users with admin privileges can access `/admin`
- Non-admin users are redirected to the home page
- Unauthenticated users are redirected to the login page 