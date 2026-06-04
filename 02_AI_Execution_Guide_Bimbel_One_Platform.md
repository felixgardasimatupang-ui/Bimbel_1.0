# Bimbel One Platform
## AI Execution Guide

**Version:** 1.0  
**Purpose:** Execution blueprint for AI coding agents, product builders, and implementation teams  
**Reference:** Must follow the PRD exactly unless explicitly approved by product owner

---

## Table of Contents
1. Purpose
2. Execution Rules
3. Product Boundaries
4. Architecture Constraints
5. Domain Breakdown
6. Delivery Order
7. Data and API Standards
8. UI/UX Standards
9. Quality Gates
10. Implementation Checklist
11. Definition of Done
12. Agent Prompts and Operating Rules
13. Anti-Patterns to Avoid
14. Release Strategy
15. Change Control

---

## 1. Purpose

This document instructs AI coding agents on how to execute the Bimbel One Platform project safely, consistently, and in alignment with the PRD.

The AI must optimize for:
- correctness over speed,
- maintainability over cleverness,
- clarity over unnecessary abstraction,
- modularity over monolithic coupling,
- direct compliance with the PRD.

---

## 2. Execution Rules

### Rule 1 — Follow the PRD
Do not invent new product scope unless the PRD explicitly allows it.

### Rule 2 — Build in Priority Order
Implement foundational capabilities before advanced features.

### Rule 3 — Keep Domains Isolated
Each module must have its own boundaries, services, entities, and tests.

### Rule 4 — Prefer Clean Contracts
Use explicit DTOs, clear interfaces, and documented endpoints.

### Rule 5 — Avoid Premature Microservices
Start as a modular monolith unless scale requires otherwise.

### Rule 6 — Make Everything Auditable
Important mutations must generate audit logs.

### Rule 7 — Design for Branch Isolation
Nearly all business data must be branch-aware.

### Rule 8 — Keep UX Clean and Minimal
Avoid cluttered screens and over-complex flows.

---

## 3. Product Boundaries

### Allowed
- Authentication and authorization
- Branch-aware management
- Student, parent, tutor, employee, and admin workflows
- Academic operations
- Billing and payments
- Payroll and reporting
- Notification automation
- Open API and webhooks
- Helpdesk and support
- Inventory and assets

### Not Allowed Unless Approved
- Full accounting suite replacement
- Custom video conferencing engine
- AI-generated exam scoring beyond simple automation
- Hidden background features not described in the PRD
- Complex enterprise workflow engines unrelated to tutoring operations

---

## 4. Architecture Constraints

### Required Architecture
- Modular monolith first
- Explicit module boundaries
- PostgreSQL as source of truth
- Redis for cache and background coordination
- Object storage for files
- Queue/broker for async tasks
- API gateway in front of services

### Recommended Tech Stack
- Backend: NestJS or Go
- Web: Next.js
- Mobile: Flutter
- Database: PostgreSQL
- Cache: Redis
- Storage: S3-compatible storage
- Queue: RabbitMQ or NATS
- Observability: logs, metrics, alerts

### Architectural Principles
- Domain-driven module organization
- No shared mutable business logic across modules without a service contract
- No direct database coupling between unrelated modules
- Keep API responses stable and versioned

---

## 5. Domain Breakdown

### 5.1 Identity and Access
Responsibilities:
- Login
- Session management
- Role and permission checks
- SSO-ready auth layer
- Audit logs for security-sensitive actions

### 5.2 Master Data
Responsibilities:
- Branches
- Programs
- Levels
- Subjects
- Rooms
- Templates
- Calendar and holidays
- System settings

### 5.3 Student and Parent Management
Responsibilities:
- Profiles
- Parent relations
- Enrollment lifecycle
- Tags and segmentation
- Notes and history

### 5.4 CRM / Admissions
Responsibilities:
- Lead capture
- Trial booking
- Follow-up pipeline
- Conversion tracking
- Source attribution

### 5.5 Employee and Tutor Management
Responsibilities:
- Employee profiles
- Contract and documents
- Leave and shift
- Tutor assignments
- Self-service access

### 5.6 Attendance
Responsibilities:
- Student attendance
- Employee attendance
- QR/code/GPS check-in
- Status and validation
- Attendance events for payroll and notifications

### 5.7 Academic Scheduling
Responsibilities:
- Class calendar
- Tutor assignment
- Room allocation
- Conflict detection
- Rescheduling

### 5.8 LMS
Responsibilities:
- Materials
- Homework
- Announcements
- Progress tracking
- Class content access

### 5.9 Exams and Question Bank
Responsibilities:
- Question CRUD
- Tagging and versioning
- Exam generation
- Auto grading
- Result analysis

### 5.10 Billing and Payments
Responsibilities:
- Invoice generation
- Payment plan tracking
- Discount and voucher support
- Payment status updates
- Reconciliation

### 5.11 Payroll
Responsibilities:
- Teaching hour calculation
- Attendance-based payroll rules
- Deductions and bonuses
- Approval flow
- Payslip generation

### 5.12 Notifications
Responsibilities:
- WhatsApp
- Email
- Push
- In-app notifications
- Delivery logs and retries

### 5.13 Reporting and BI
Responsibilities:
- Operational dashboards
- Owner insights
- Exportable reports
- Branch summaries

### 5.14 Inventory and Assets
Responsibilities:
- Stock in/out
- Asset movement
- Maintenance tracking
- Branch assignment

### 5.15 Helpdesk
Responsibilities:
- Ticket intake
- Assignment
- Resolution tracking
- SLA visibility

### 5.16 API and Integrations
Responsibilities:
- Webhooks
- External API keys
- Rate limiting
- Third-party connections

---

## 6. Delivery Order

Implement in this order unless the product owner changes priority:

### Phase A — Foundation
1. Auth and RBAC
2. Branch management
3. Master data
4. Audit logs
5. Base UI shell

### Phase B — Core Operations
1. Student management
2. Parent management
3. Employee and tutor management
4. Attendance
5. Scheduling

### Phase C — Monetization
1. Billing
2. Invoice generation
3. Payment gateway integration
4. Reconciliation
5. Notifications

### Phase D — Academic Delivery
1. LMS
2. Question bank
3. Exams
4. Result reports

### Phase E — Operational Expansion
1. Payroll
2. Helpdesk
3. Inventory
4. Analytics enhancements
5. API and webhook framework

---

## 7. Data and API Standards

### Database Standards
- Use UUID primary keys unless there is a strong reason not to.
- Include created_at, updated_at, and deleted_at where appropriate.
- Use explicit foreign keys.
- Store branch_id on all branch-scoped records.
- Use soft delete only when business rules require restoration.

### API Standards
- Use RESTful endpoints for core modules.
- Version public APIs.
- Use consistent response envelopes.
- Return clear validation errors.
- Protect write endpoints with permission checks.

### Naming Standards
- Tables: plural snake_case
- Columns: snake_case
- Services: PascalCase or descriptive class names
- DTOs: explicit and module-scoped

### Event Standards
Use domain events for:
- invoice created
- payment confirmed
- attendance recorded
- exam completed
- payroll approved
- notification sent

---

## 8. UI/UX Standards

### Design Principles
- Minimal and professional appearance
- Clear hierarchy
- Low cognitive load
- Consistent spacing and typography
- Responsive layouts
- Role-specific navigation

### Required UI Behaviors
- Search-first tables for data-heavy screens
- Filter chips for branch, status, and period
- Clear empty states
- Inline validation
- Action confirmation for destructive changes
- Visible status labels for finance and attendance

### Screen Priorities
- Login
- Dashboard
- Branch selector
- Student profile
- Attendance screen
- Schedule calendar
- Invoice detail
- Payment status page
- Tutor dashboard
- Parent dashboard

---

## 9. Quality Gates

Before marking any feature as complete, verify:

- Functional requirements are met
- Permission checks work correctly
- Audit logs are generated
- Validation is present
- API contract is documented
- Empty/error/loading states are handled
- Mobile responsiveness is acceptable
- Tests pass
- No critical regression is introduced

---

## 10. Implementation Checklist

### For every module
- [ ] Domain model defined
- [ ] Database migration added
- [ ] Repository or data access implemented
- [ ] Service layer implemented
- [ ] API endpoints implemented
- [ ] Permission checks added
- [ ] Validation rules added
- [ ] Audit logging included
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Basic documentation updated

### For every release
- [ ] Backward compatibility checked
- [ ] Seed data reviewed
- [ ] Error messages verified
- [ ] Logging is sufficient
- [ ] Monitoring hooks prepared
- [ ] Rollback plan available

---

## 11. Definition of Done

A feature is done only when all of the following are true:

- It matches the PRD.
- It is documented.
- It has tests.
- It respects permissions.
- It works for the correct branch scope.
- It logs meaningful events.
- It is reviewable and maintainable.
- It does not break existing flows.

---

## 12. Agent Prompts and Operating Rules

### When the AI is asked to build a feature
1. Identify the module.
2. Confirm the exact requirement from the PRD.
3. Define data model changes.
4. Define service logic.
5. Define API contract.
6. Define UI states.
7. Implement tests.
8. Validate permission and audit flow.

### When requirements are unclear
- Do not guess silently.
- Ask for the smallest clarification possible.
- Prefer implementing the safe minimum.

### When a request conflicts with PRD
- Follow the PRD.
- Flag the conflict.
- Propose a controlled change request instead of improvising.

---

## 13. Anti-Patterns to Avoid

- Hardcoding branch logic
- Embedding permission logic directly in UI only
- Mixing billing logic with attendance logic without clear service boundaries
- Creating duplicate sources of truth
- Using vague field names
- Skipping audit logs on important changes
- Building features before core auth and master data are stable
- Overengineering with microservices too early
- Writing large untested business logic blocks

---

## 14. Release Strategy

### Release 1
- Auth
- RBAC
- Branches
- Master data

### Release 2
- Student and employee management
- Attendance
- Scheduling

### Release 3
- Billing
- Invoice
- Notifications

### Release 4
- Payment gateway
- Payroll
- Dashboard improvements

### Release 5
- LMS
- Question bank
- Exams

### Release 6
- Helpdesk
- Inventory
- API integrations

---

## 15. Change Control

Any scope change must include:
- Reason for change
- Impact analysis
- Module affected
- Data model impact
- API impact
- UI impact
- Migration plan
- Rollback plan

Do not implement scope changes without explicit approval.

---

## Appendix A — AI Build Order

1. Establish repository structure
2. Set up auth and permissions
3. Add branch-aware master data
4. Build student and employee modules
5. Implement attendance and scheduling
6. Add billing and notifications
7. Add payment gateway and payroll
8. Add LMS and exams
9. Add helpdesk and inventory
10. Polish dashboards and integrations

---

## Appendix B — Non-Negotiable Constraints

- Must be branch-aware
- Must be auditable
- Must be modular
- Must use clean API contracts
- Must stay aligned with PRD
- Must prioritize stability and maintainability over feature breadth

