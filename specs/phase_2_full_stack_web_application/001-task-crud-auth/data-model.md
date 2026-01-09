# Data Model: Task CRUD Operations with Authentication

## Entity: User

**Purpose**: Represents an authenticated account in the system

**Attributes**:
- `id`: UUID (Primary Key, auto-generated)
- `email`: String (unique, indexed, 1-255 characters, validated format)
- `password_hash`: String (bcrypt hashed, 60 characters)
- `created_at`: DateTime (timestamp, auto-managed)
- `updated_at`: DateTime (timestamp, auto-managed)

**Relationships**:
- One User has Many Tasks (one-to-many relationship)

**Constraints**:
- Email uniqueness enforced at database level
- Password must be bcrypt hashed (never stored in plaintext)
- Created/updated timestamps automatically managed

## Entity: Task

**Purpose**: Represents a todo item belonging to a specific user

**Attributes**:
- `id`: Integer (Primary Key, auto-increment)
- `user_id`: UUID (Foreign Key, references users.id, indexed, required)
- `title`: String (1-200 characters, required)
- `description`: String (optional, max 1000 characters)
- `completed`: Boolean (default False, indexed)
- `created_at`: DateTime (timestamp, auto-managed)
- `updated_at`: DateTime (timestamp, auto-managed)

**Relationships**:
- Each Task belongs to One User (many-to-one relationship)
- User deletion cascades to tasks (ON DELETE CASCADE)

**Constraints**:
- Title length: 1-200 characters (validated at application and database level)
- Description length: max 1000 characters (validated at application and database level)
- Completed status: boolean (no intermediate states)
- User_id foreign key constraint with index for efficient filtering
- Created/updated timestamps automatically managed

## Database Indexes

**Required Indexes**:
- `users.email` (unique index for fast authentication lookup)
- `tasks.user_id` (foreign key index for efficient user task queries)
- `tasks.completed` (index for status filtering optimization)

## State Transitions

**Task Completion**:
- `completed: false` → `completed: true` (toggle complete)
- `completed: true` → `completed: false` (toggle incomplete)
- Updated_at timestamp automatically updated on any change

## Validation Rules

**User Validation**:
- Email format: Must contain @ and valid domain structure
- Email uniqueness: Enforced at database level
- Password: Minimum 8 characters (bcrypt hashed before storage)

**Task Validation**:
- Title: 1-200 characters (required)
- Description: 0-1000 characters (optional)
- User ownership: Tasks can only be accessed by their owner (user_id check)

## Security Considerations

**Data Isolation**:
- ALL database queries MUST filter by authenticated user's user_id
- Foreign key constraints prevent orphaned tasks
- User deletion cascades to remove all associated tasks
- No cross-user data access possible through database constraints