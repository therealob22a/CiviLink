### *Folder Organization, Project Conventions & Development Standards for Civilink*

This document explains how the Civilink project must be structured and maintained.
These rules apply to **all team members**, including frontend, backend, and Scrum Master.

---

# **1. Final Project Directory Structure**

```
civilink-project/
│
├── client/                        # React Frontend (Pure JS)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── features/              # citizen/officer/admin modules
│   │   │   ├── citizen/
│   │   │   ├── officer/
│   │   │   └── admin/
│   │   ├── services/              # API calls only
│   │   ├── hooks/                 # custom hooks
│   │   ├── utils/                 # helpers only
│   │   ├── styles/
│   │   └── __tests__/             # Jest & RTL tests
│   ├── package.json
│   └── .env.example
│
├── server/                        # Node.js Backend (Pure JS)
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validations/               # Joi/Zod/express-validator
│   ├── config/                    # DB, ENV, init files
│   ├── helpers/                   # email, hashing, notifications
│   ├── repositories/              # database access layer
│   ├── __tests__/                 # Jest tests
│   ├── package.json
│   └── .env.example
│
├── docs/                          # ALL PM + SCRUM DOCUMENTATION
│   ├── product/
│   ├── scrum/
│   ├── academic/
│   ├── technical/
│   ├── risks-and-project-plans/
│   └── user-guides/
│
├── .github/
│   └── workflows/                 # GitHub Actions CI/CD
│
├── assets/
│   ├── images/
│   └── logos/
│
└── Root Files
    ├── .env.example
    ├── .gitignore
    ├── README.md
    └── CONTRIBUTING.md
```

---

# **2. Naming Conventions**

### **General**

* Files: `lowercase-with-hyphens.js`
* Components: `PascalCase.jsx`
* Hooks: `useSomething.js`
* Functions/Variables: `camelCase`
* Environment variables: `UPPER_SNAKE_CASE`

### **Folders**

```
controllers/
services/
repositories/
validations/
middleware/
```

---

# **3. Backend Architecture Rules (Pure Node.js + Express)**

### **Controllers**

* Handle request/response
* No business logic
* No database calls

### **Services**

* Contains business logic
* Calls repositories
* No Express objects (`req`, `res`)

### **Repositories**

* Database interaction only (Mongo or Render-provided DB)
* Reusable methods: `create`, `update`, `find`, etc.

### **Validations**

* Must validate body, params, queries before calling controller

### **Middleware**

* Auth
* Role-checking
* Request logging
* Input sanitization

---

# **4. RBAC — Role Based Access Control**

Roles:

* **Citizen**
* **Officer**
* **Admin**

Each protected route must apply:

```
authMiddleware
roleCheck(["officer"])
```

JWT should minimally contain:

```
userId
role
```

---

# **5. Environment Variables (Render-Compatible)**

### Render loads environment variables directly — no Docker needed.

### Required variables example:

```
MONGO_URI=
JWT_SECRET=
EMAIL_SERVICE_KEY=
EMAIL_FROM=
CORS_ORIGIN=
```

### Rules

* Never commit `.env`
* Both `/client/.env.example` and `/server/.env.example` must be maintained
* Sensitive values go into Render Dashboard → Environment

---

# **6. Testing Standards (MANDATORY)**

### **Frontend (React)**

Tools:

* **Jest**
* **React Testing Library**
* **Cypress (E2E)**

Tests Required For:

* Components with logic
* API services
* Authentication flows
* Role-based navigation

Folder:
`client/src/__tests__/`

### **Backend (Node.js)**

Tools:

* **Jest**
* **Supertest** (for endpoints)

Tests Required For:

* controllers (integration)
* services (unit tests)
* repositories (mocked DB)
* middleware (auth & role-check)

Folder:
`server/__tests__/`

### **Rule:**

All new features MUST include tests **if they contain any logic**, especially:

* approvals/rejections
* form validation
* registration/login
* dashboard filtering
* API communication

---

# **7. Git Workflow**

Branches:

```
main
dev
feature/<feature-name>
bugfix/<bug-name>
docs/<name>
```

Rules:

* No direct commits to `main`
* All PRs must:

  * Follow Conventional Commits
  * Contain related tests
  * Contain a summary
  * Reference a Jira/Issue number

### Commit Examples

```
feat: citizen can submit TIN application
fix: officer approval failing due to null requestId
test: add Cypress tests for admin dashboard routing
docs: add RBAC documentation
```

---

# **8. API Structure**

Example folder:

```
server/routes/citizenRoutes.js
server/routes/officerRoutes.js
server/routes/adminRoutes.js
```

URL format:

```
/api/v1/citizen/tin
/api/v1/citizen/vital
/api/v1/officer/requests
/api/v1/admin/users
/api/v1/auth/login
/api/v1/auth/register
```

---

# **9. Frontend Structure Rules**

### Pages (`/pages`)

* Must map to real routes

### Features Directory

```
features/citizen/
features/officer/
features/admin/
```

Each feature may contain:

```
component/
hooks/
services/
utils/
```

### Services (`/services`)

* Contains ONLY API calls
* No UI logic
* No state logic

### Hooks (`/hooks`)

* Reusable logic
* Shared helpers

---

# **10. Documentation Rules**

All documentation goes under `/docs`.

### Required Docs:

* PM/Product documents → `/docs/product/`
* Scrum Master documents → `/docs/scrum/`
* Technical API docs → `/docs/technical/api/`
* Deployment notes for Render → `/docs/technical/deployment/`

---

# **11. Deployment Rules (Render)**

* Frontend: deploy as static site
* Backend: deploy as a Render Web Service
* Must include:

  * `build` command for React
  * `start` script for Express

---

# **12. Change Control**

A feature is "done" only when:

1. Code is completed
2. Tests are written
3. API docs updated
4. UI flows validated
5. PR reviewed and merged
6. Deployed on Render
7. QA confirms it works
