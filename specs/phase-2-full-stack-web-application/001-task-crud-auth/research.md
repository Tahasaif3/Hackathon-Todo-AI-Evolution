# Research: Task CRUD Operations with Authentication

## Technology Decisions

### Language/Version
- **Frontend**: TypeScript 5.x with Next.js 16+
- **Backend**: Python 3.13+ with UV package manager
- **Rationale**: Aligned with Phase II Constitution requirements

### Primary Dependencies
- **Frontend**: Next.js 16+ (App Router), React 19+, Better Auth (JWT plugin), Tailwind CSS 4.x, TypeScript 5.x
- **Backend**: FastAPI 0.115+, SQLModel 0.0.24+, Pydantic v2, python-jose (JWT), bcrypt, psycopg2-binary, Alembic (migrations)
- **Database**: PostgreSQL 16
- **Development**: Docker 24+, Docker Compose 2.x
- **Rationale**: All selected technologies comply with Phase II Constitution requirements

### Storage
- **Database**: PostgreSQL 16 (local Docker container for development, Neon Serverless PostgreSQL for production)
- **Rationale**: Constitution mandates Neon Serverless PostgreSQL with SQLModel ORM

### Testing
- **Frontend**: Jest + React Testing Library (component tests), Playwright (E2E tests)
- **Backend**: pytest + pytest-asyncio (API integration tests, unit tests)
- **Coverage Target**: Minimum 80% for both frontend and backend
- **Rationale**: Constitution mandates minimum 80% coverage for Phase II+

### Target Platform
- **Frontend**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 years)
- **Backend**: Linux container (Docker-based deployment)
- **Development**: Cross-platform (Windows/macOS/Linux with Docker)
- **Rationale**: Standard web application platform per constitution

### Project Type
- **Web application** (monorepo with frontend and backend)
- **Rationale**: Constitution requires Next.js 16+ frontend with FastAPI backend in monorepo structure

### Performance Goals
- API Response Time: <200ms (p95) under normal load
- Page Load Time: <2s for initial dashboard load
- Hot Reload: <3s for code changes during development
- Database Queries: Optimized with indexes on user_id, completed fields
- Concurrent Users: Support 100+ simultaneous users without degradation
- **Rationale**: Derived from success criteria in feature specification

### Constraints
- Security: User data isolation (100% query filtering by user_id), JWT validation on all protected endpoints, 404 (not 403) for unauthorized access
- Development: Single-command startup (docker-compose up), hot reload for rapid iteration
- Database: Same schema works in Docker PostgreSQL and Neon (connection string only)
- Authentication: 7-day JWT token expiration, httpOnly cookie storage
- Validation: Title 1-200 chars, description max 1000 chars, email format validation
- Error Handling: User-friendly messages, proper HTTP status codes
- **Rationale**: All constraints from constitution and feature specification

### Scale/Scope
- Expected Users: 100-1000 concurrent users
- Data Volume: 0-1000 tasks per user (pagination deferred to Phase III)
- Deployment: Single region, horizontal scaling via container orchestration
- MVP Scope: 7 user stories (registration, login, view, create, update, delete, toggle tasks)
- **Rationale**: Based on feature specification assumptions and success criteria

## Best Practices Researched

### Next.js 16+ App Router
- Decision: Use Server Components by default, Client Components only for interactivity
- Rationale: Reduces JavaScript bundle size, improves performance, aligns with React 19 direction
- Alternatives: Pages Router (rejected - not Phase II compliant)

### Better Auth + JWT Integration
- Decision: Better Auth on frontend with JWT plugin, shared BETTER_AUTH_SECRET for backend validation
- Rationale: Type-safe authentication library designed for Next.js, built-in JWT support
- Alternatives: NextAuth (rejected - Less type-safe), Auth0 (rejected - Third-party dependency)

### SQLModel for Database ORM
- Decision: SQLModel with SQLAlchemy 2.0 core, Pydantic v2 integration
- Rationale: Combines SQLAlchemy ORM with Pydantic validation, full type safety
- Alternatives: Raw SQLAlchemy (rejected - violates constitution), Tortoise ORM (rejected - less mature)

### Docker Compose Local Development
- Decision: 3 services (db, backend, frontend) with volume persistence and hot reload
- Rationale: Reproducible environment, matches production architecture, enables rapid iteration
- Alternatives: Local installations (rejected - environment inconsistency), Cloud-only (rejected - slow iteration)

### Neon PostgreSQL for Production
- Decision: Neon Serverless PostgreSQL with connection pooling
- Rationale: Serverless scaling, same PostgreSQL 16 compatibility as local Docker
- Alternatives: RDS (rejected - more expensive), Supabase (rejected - additional features not needed)