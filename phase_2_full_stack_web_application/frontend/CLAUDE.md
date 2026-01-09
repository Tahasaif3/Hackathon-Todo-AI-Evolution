# Claude Agent Instructions - Frontend

## Context

You are working in the **Next.js 16+ frontend** of a full-stack task management application.

**Parent Instructions**: See root `CLAUDE.md` for global rules.

## Technology Stack

- **Next.js 16+** with App Router (MANDATORY)
- **TypeScript** strict mode
- **Tailwind CSS** for ALL styling
- **Better Auth** with JWT plugin
- **React 19+**

## Critical Requirements

### App Router (NOT Pages Router)

**File Structure**:
```
app/
├── layout.tsx          # Root layout (Server Component)
├── page.tsx            # Home page (Server Component)
├── register/
│   └── page.tsx        # Registration page
├── login/
│   └── page.tsx        # Login page
└── tasks/
    ├── page.tsx        # Task list
    ├── [id]/
    │   └── page.tsx    # Task detail/edit
    └── new/
        └── page.tsx    # Create task
```

### Server vs Client Components

**Server Components (Default)**:
- Pages (`page.tsx`)
- Layouts (`layout.tsx`)
- Static UI components
- Data fetching components

**Client Components** (use `'use client'` directive):
- Forms with `useState`, `onChange`, `onSubmit`
- Interactive buttons with `onClick`
- Components using React hooks
- Components with browser APIs

**Example**:
```typescript
// components/TaskForm.tsx
'use client'  // Required for forms!

import { useState } from 'react'

export default function TaskForm() {
  const [title, setTitle] = useState('')
  // ... form logic
}
```

### Styling (Tailwind Only)

**Allowed**:
```typescript
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Click me
</button>
```

**Forbidden**:
```typescript
// NO inline styles
<button style={{ backgroundColor: 'blue' }}>No</button>

// NO CSS modules
import styles from './Button.module.css'
```

## Authentication Flow

### Better Auth Setup

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { jwt } from "@better-auth/jwt-plugin"

export const auth = betterAuth({
  plugins: [
    jwt({
      secret: process.env.BETTER_AUTH_SECRET!,
      expiresIn: '7d'
    })
  ]
})
```

### API Client Pattern

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await auth.getSession() // Get JWT from Better Auth

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
}

export async function getTasks(userId: string) {
  const response = await fetchWithAuth(`/api/${userId}/tasks`)
  return response.json()
}
```

## Component Patterns

### Loading States

```typescript
'use client'

export default function TaskList() {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetchTasks().finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />
  return <div>{/* tasks */}</div>
}
```

### Error Handling

```typescript
const [error, setError] = useState<string | null>(null)

try {
  await createTask(data)
} catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred')
}

{error && <ErrorMessage message={error} />}
```

## Testing

**Component Tests** (Jest + React Testing Library):
```typescript
import { render, screen } from '@testing-library/react'
import TaskItem from './TaskItem'

test('displays task title', () => {
  render(<TaskItem task={{ title: 'Test' }} />)
  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

**E2E Tests** (Playwright):
```typescript
import { test, expect } from '@playwright/test'

test('user can create task', async ({ page }) => {
  await page.goto('http://localhost:3000/tasks/new')
  await page.fill('input[name="title"]', 'New Task')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/tasks')
})
```

## Common Mistakes to Avoid

❌ Using Pages Router (`pages/` directory)
✅ Use App Router (`app/` directory)

❌ Client Component for static content
✅ Server Component by default

❌ Inline styles or CSS modules
✅ Tailwind utility classes only

❌ Forgetting `'use client'` directive
✅ Add to top of file for interactive components

❌ Trusting `user_id` from URL without validation
✅ Always verify with JWT token

## File Locations

- Pages: `app/*/page.tsx`
- Components: `components/*.tsx`
- API Client: `lib/api.ts`
- Auth Config: `lib/auth.ts`
- Types: `lib/types.ts`
- Tests: `tests/` or `__tests__/`

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-change-in-production
```

## References

- Root Instructions: `../CLAUDE.md`
- Feature Spec: `../specs/001-task-crud-auth/spec.md`
- Constitution: `../.specify/memory/constitution.md`