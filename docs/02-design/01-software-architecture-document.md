# Core Platform Software Architecture Document (SAD)

---

## Document Information

| Field | Value |
|-------|-------|
| Project Name | Core Platform |
| Document Title | Software Architecture Document |
| Document ID | CP-SAD-001 |
| Version | 1.0.0 |
| Status | Draft |
| Author | BEH NELSON CHU |

---

# Table of Contents

1. Introduction
2. Architecture Overview
3. Architectural Style
4. Technology Stack
5. High-Level Architecture
6. Frontend Architecture
7. Backend Architecture
8. Database Architecture
9. Security Architecture
10. Deployment Architecture
11. Module Architecture
12. Design Principles
13. Conclusion

1. Introduction

This document describes the software architecture of Core Platform. It defines the architectural style, system components, technology stack, and interactions between the frontend, backend, and database.

2. Architecture Overview

Core Platform follows a modular architecture based on Clean Architecture principles. The system separates presentation, business logic, and infrastructure to improve maintainability, scalability, and testability.

3. Architectural Style

The platform adopts:

Clean Architecture
Feature-Based Modular Architecture
Repository Pattern
Use Case Pattern
Dependency Injection

4. Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui

Backend
NestJS
Node.js
TypeScript
Prisma

Database
PostgreSQL

Tools
Docker
Git
GitHub
Swagger
Postman

5. High-Level Architecture
                    Users
                       │
                       ▼
              Next.js Frontend
                       │
                 REST API (HTTPS)
                       │
                       ▼
               NestJS Backend
                       │
                Use Case Layer
                       │
               Repository Layer
                       │
                  Prisma ORM
                       │
                       ▼
                  PostgreSQL

6. Frontend Architecture

The frontend is built using Next.js with a Feature-Based Architecture.

Structure
src/
│
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── contexts/
├── providers/
├── lib/
├── types/
├── utils/
└── styles/
Responsibilities
User Interface
Routing
Form Validation
State Management
API Communication
Responsive Design

7. Backend Architecture

The backend follows Clean Architecture.

Presentation Layer
        │
        ▼
Application Layer (Use Cases)
        │
        ▼
Domain Layer
        │
        ▼
Infrastructure Layer
        │
        ▼
PostgreSQL
Layers

Presentation

Controllers
DTOs
Validation

Application

Use Cases

Domain

Entities
Repository Interfaces

Infrastructure

Prisma
Repository Implementations
External Services

8. Database Architecture

Database: PostgreSQL

ORM: Prisma

Characteristics:

UUID Primary Keys
Foreign Keys
Soft Deletes
Audit Fields
Indexes
Transactions

9. Security Architecture

Authentication

JWT

Authorization

RBAC
Permission-Based Access

Security Features

bcrypt Password Hashing
HTTPS
Input Validation
Rate Limiting
Audit Logging

10. Deployment Architecture
Browser
    │
    ▼
Next.js Frontend
    │
HTTPS
    │
    ▼
NestJS Backend
    │
    ▼
PostgreSQL Database

Docker will be used for deployment.

11. Module Architecture

Foundation Modules

Authentication
Users
Roles
Permissions
Organization
Profile

Platform Modules

Dashboard
Settings
Notifications
File Manager
Audit Logs
Activity Logs
Health Check
API Documentation

Business Modules

These will be added in client projects and are not part of Core Platform.

Examples:

Hospital
Inventory
School
Hotel
CRM

12. Design Principles

The architecture follows:

SOLID
DRY
KISS
Separation of Concerns
Dependency Injection
Clean Architecture
Feature-Based Development
Reusable Components

13. Conclusion

Core Platform uses a modular and scalable architecture designed to support rapid development of enterprise applications. The architecture promotes maintainability, reusability, security, and consistency across future projects.