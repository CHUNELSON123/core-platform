# Core Platform Database Design Document (DBD)

---

## Document Information

| Field | Value |
|-------|-------|
| Project Name | Core Platform |
| Document Title | Database Design Document |
| Document ID | CP-DBD-001 |
| Version | 1.0.0 |
| Status | Draft |
| Author | BEH NELSON CHU |

---

# Table of Contents

1. Introduction
2. Database Overview
3. Database Standards
4. Entity List
5. Entity Relationships
6. Naming Conventions
7. Data Integrity
8. Conclusion

1. Introduction

This document defines the logical database design for Core Platform. It specifies the database standards, entities, relationships, and conventions that will be implemented using PostgreSQL and Prisma ORM.

2. Database Overview

Database: PostgreSQL

ORM: Prisma

Primary Key: UUID

Soft Delete: Yes

Audit Fields: Yes

Migrations: Prisma Migrate

3. Database Standards
The Core Platform database follows the following standards:

- UUIDs are used as primary keys.
- Table names use plural nouns.
- Column names use snake_case.
- Foreign key constraints are enforced.
- Every table includes `created_at` and `updated_at`.
- Tables that support soft deletion include `deleted_at`.
- Audit fields (`created_by`, `updated_by`, `deleted_by`) are included where applicable.
- Prisma Migrate is used for database migrations.
- Database transactions are used for critical operations.

4. Entity List

For Core Platform v1.0, these are the tables:

Module	        Tables
Authentication	users, sessions, refresh_tokens
Authorization	roles, permissions, user_roles, role_permissions
Organization	organizations
User	        user_profiles
Notifications	notifications
Files	        files
Settings	    settings
Logging	audit_logs, activity_logs

5. Relationships
organizations (1) ──────────────── (*) users

users (1) ──────────────────────── (1) user_profiles

users (*) ─────────────── (*) roles
                │
          user_roles

roles (*) ─────────────── (*) permissions
                │
       role_permissions

users (1) ──────────────────────── (*) sessions

users (1) ──────────────────────── (*) refresh_tokens

users (1) ──────────────────────── (*) notifications

users (1) ──────────────────────── (*) files

users (1) ──────────────────────── (*) audit_logs

users (1) ──────────────────────── (*) activity_logs

organizations (1) ──────────────── (1) settings

6. Naming Conventions

Tables: plural

Columns: snake_case

Primary Key: id

Foreign Keys:

user_id
role_id
organization_id

7. Data Integrity
The following rules ensure data consistency:

- Primary keys uniquely identify each record.
- Foreign keys maintain referential integrity.
- Required fields use NOT NULL constraints.
- Unique constraints prevent duplicate values where necessary.
- Transactions are used for critical operations involving multiple tables.
- Soft deletion is used where business requirements require record recovery.

8. Database Naming Standards

| Item | Standard |
|------|----------|
| Tables | plural |
| Columns | snake_case |
| Primary Key | id |
| Foreign Key | entity_id |
| Boolean | is_* |
| Timestamp | *_at |
| Junction Tables | entity_entity |

9. Conclusion

The database is designed to support a modular, scalable, and secure architecture while remaining reusable across future business applications.