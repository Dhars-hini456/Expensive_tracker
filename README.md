# 💰 Expense Tracker — Full-Stack CRUD Web Application

A complete, production-style full-stack web application for tracking personal
expenses, built with **React** on the frontend and **Django + Django REST
Framework** on the backend, backed by **SQLite**.

---

## 1. Project Overview

Expense Tracker is a CRUD (Create, Read, Update, Delete) web application that
lets a user record, browse, search, filter and analyze their day-to-day
spending. It exposes a clean REST API consumed by a React single-page
application, and demonstrates a realistic, end-to-end separation between
frontend and backend — the kind of architecture used in real-world web
products.

## 2. Problem Statement

Manually tracking daily expenses (in notebooks, memory, or scattered notes)
makes it hard to know where money goes, spot overspending in a category, or
review spending over a date range. There is no simple way to search past
transactions or see totals at a glance.

## 3. Objectives

- Provide a simple form to record an expense with all relevant details.
- Let the user view, search and filter their expense history.
- Show real-time totals and a category-wise breakdown.
- Allow editing and deleting existing records safely (with confirmation).
- Enforce validation on both the client and the server so bad data never
  reaches the database.
- Expose a well-structured REST API that can be tested independently with
  Postman.

## 4. Features

- ✅ Add an expense (title, amount, category, date, payment method, description)
- ✅ View all expenses in a responsive, sortable table
- ✅ View full details of a single expense
- ✅ Edit / update an existing expense
- ✅ Delete an expense with a confirmation modal
- ✅ Search expenses by title/description
- ✅ Filter expenses by category
- ✅ Filter expenses by date range
- ✅ Automatic calculation of total expenses & average per expense
- ✅ Category-wise expense summary with visual bars
- ✅ Client-side **and** server-side form validation
- ✅ Success/error toast notifications for every action
- ✅ Clean, modern, fully responsive UI (mobile, tablet, desktop)

## 5. Technology Stack

| Layer            | Technology                                   |
|-------------------|-----------------------------------------------|
| Frontend          | React 18, React Router 6, Axios, CSS3          |
| Backend           | Python 3, Django 4.2, Django REST Framework    |
| Database          | SQLite (via Django ORM)                        |
| Filtering         | django-filter                                  |
| Cross-Origin      | django-cors-headers                            |
| API Testing       | Postman (collection included)                  |
| Version Control   | Git / GitHub                                   |

## 6. System Architecture

```
┌──────────────────────┐        HTTP / JSON (REST)        ┌───────────────────────┐
│   React Frontend      │  ───────────────────────────▶   │  Django REST Backend   │
│  (localhost:3000)     │  ◀───────────────────────────   │   (localhost:8000)     │
│                        │                                   │                        │
│  Dashboard, Forms,     │                                   │  ExpenseViewSet        │
│  Axios API client      │                                   │  Serializers / Filters │
└──────────────────────┘                                   └───────────┬────────────┘
                                                                          │ Django ORM
                                                                          ▼
                                                              ┌───────────────────────┐
                                                              │   SQLite Database      │
                                                              │     (db.sqlite3)       │
                                                              └───────────────────────┘
```

The frontend never talks to the database directly — every operation goes
through the versioned REST API, which validates data, applies business rules,
and returns structured JSON responses (including clear error messages).

## 7. Database Structure

**Table: `expenses_expense`**

| Field           | Type            | Constraints                                   |
|------------------|-----------------|------------------------------------------------|
| id               | BigAutoField    | Primary key, auto-increment                     |
| title            | CharField(200)  | Required                                        |
| amount           | Decimal(10,2)   | Required, must be > 0 and ≤ 10,000,000          |
| category         | CharField(20)   | Required, one of 8 fixed choices                |
| date             | DateField       | Required, cannot be in the future               |
| payment_method   | CharField(20)   | Required, one of 5 fixed choices                |
| description      | TextField(1000) | Optional, max 1000 characters                   |
| created_at       | DateTimeField   | Auto-set on creation, read-only                 |

**Categories:** Food, Transport, Shopping, Education, Bills, Healthcare,
Entertainment, Other

**Payment Methods:** Cash, Credit Card, Debit Card, UPI, Bank Transfer

Migrations are included in `backend/expenses/migrations/`, so the schema is
created automatically the first time you run `python manage.py migrate` — no
manual SQL required.

## 8. API Endpoints

Base URL: `http://127.0.0.1:8000/api/`

| Method | Endpoint                            | Description                                      |
|--------|--------------------------------------|---------------------------------------------------|
| GET    | `/expenses/`                        | List all expenses                                  |
| POST   | `/expenses/`                        | Create a new expense                               |
| GET    | `/expenses/{id}/`                   | Retrieve a single expense                          |
| PUT    | `/expenses/{id}/`                   | Full update of an expense                          |
| PATCH  | `/expenses/{id}/`                   | Partial update of an expense                       |
| DELETE | `/expenses/{id}/`                   | Delete an expense                                  |
| GET    | `/expenses/summary/`                | Total amount, count, category & payment breakdown  |
| GET    | `/expenses/categories/`             | List of valid category choices                     |
| GET    | `/expenses/payment_methods/`        | List of valid payment method choices                |

**Query parameters** (usable on `/expenses/` and `/expenses/summary/`):

| Param        | Example                              | Effect                                  |
|---------------|----------------------------------------|-------------------------------------------|
| `search`      | `?search=grocery`                     | Matches title or description               |
| `category`    | `?category=Food`                      | Exact category filter                      |
| `payment_method` | `?payment_method=UPI`              | Exact payment method filter                 |
| `date`        | `?date=2026-09-10`                    | Exact date match                            |
| `date_from`   | `?date_from=2026-09-01`               | Date range start (inclusive)                |
| `date_to`     | `?date_to=2026-09-30`                 | Date range end (inclusive)                  |
| `min_amount` / `max_amount` | `?min_amount=100&max_amount=500` | Amount range filter              |
| `ordering`    | `?ordering=-amount`                   | Sort by `date`, `amount`, `title`, `created_at` (prefix `-` for descending) |

**Example success response — `POST /api/expenses/`:**

```json
{
  "message": "Expense created successfully.",
  "data": {
    "id": 1,
    "title": "Grocery Shopping",
    "amount": "1250.50",
    "category": "Food",
    "date": "2026-09-10",
    "payment_method": "UPI",
    "description": "Weekly groceries",
    "created_at": "2026-09-17T10:15:00Z"
  }
}
```

**Example validation error — `POST /api/expenses/` with a bad amount:**

```json
{
  "amount": ["Amount must be greater than 0."]
}
```

**Example — `GET /api/expenses/summary/`:**

```json
{
  "total_amount": 4250.75,
  "total_count": 6,
  "category_summary": [
    {"category": "Food", "total": 2100.00, "count": 3},
    {"category": "Transport", "total": 850.75, "count": 2}
  ],
  "payment_method_summary": [
    {"payment_method": "UPI", "total": 3000.00, "count": 4}
  ]
}
```

## 9. Project Structure

```
expense-tracker/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── api/expenseApi.js
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Dashboard.js
│   │   │   ├── ExpenseForm.js
│   │   │   ├── ExpenseList.js
│   │   │   ├── ExpenseDetail.js
│   │   │   ├── DeleteConfirmModal.js
│   │   │   ├── SummaryCards.js
│   │   │   ├── CategorySummary.js
│   │   │   └── SearchFilter.js
│   │   ├── context/NotificationContext.js
│   │   ├── constants.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── expense_tracker/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── expenses/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── filters.py
│       ├── urls.py
│       ├── admin.py
│       ├── tests.py
│       └── migrations/0001_initial.py
├── postman_collection.json
├── README.md
└── .gitignore
```

## 10. Installation Steps

### Prerequisites

- Python 3.9+ and `pip`
- Node.js 16+ and `npm`
- Git

### Clone the repository

```bash
git clone https://github.com/<your-username>/expense-tracker.git
cd expense-tracker
```

## 11. Backend Execution

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations (see section 12)
python manage.py migrate

# (Optional) create an admin user for the Django admin panel
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

The API is now running at **http://127.0.0.1:8000/api/**
The Django admin panel is at **http://127.0.0.1:8000/admin/**

## 12. Database Migration

Migrations are already included in the repository
(`backend/expenses/migrations/0001_initial.py`), so any student who clones
the repo just needs to run:

```bash
python manage.py migrate
```

This creates `db.sqlite3` with the `Expense` table and all constraints
automatically — no manual SQL required. If you ever change `models.py`,
regenerate migrations with:

```bash
python manage.py makemigrations
python manage.py migrate
```

## 13. Frontend Execution

Open a **second terminal** (keep the backend running in the first):

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app opens automatically at **http://localhost:3000**

The frontend is pre-configured (`src/api/expenseApi.js`) to call the backend
at `http://127.0.0.1:8000/api`. If you need a different backend URL, copy
`.env.example` to `.env` and edit `REACT_APP_API_URL`.

## 14. Postman Testing

A ready-to-import collection is included: `postman_collection.json`.

1. Open Postman → **Import** → select `postman_collection.json`.
2. Make sure the Django backend is running (`python manage.py runserver`).
3. The collection variable `base_url` defaults to `http://127.0.0.1:8000/api`.
4. Run any request — the collection includes:
   - Full CRUD (Create / List / Retrieve / Update / Patch / Delete)
   - Search, category filter, date-range filter, ordering
   - Summary/statistics endpoint
   - Two intentionally invalid requests (negative amount, non-existent ID)
     to demonstrate error handling.

You can also test directly in the browser using DRF's **Browsable API** by
visiting `http://127.0.0.1:8000/api/expenses/`.

## 15. Running Automated Backend Tests

```bash
cd backend
python manage.py test
```

This runs the test suite in `expenses/tests.py`, covering listing, creation,
validation failures, retrieval of an invalid ID, updates, deletion, and the
summary endpoint.

## 16. GitHub Setup

```bash
# From the project root (expense-tracker/)
git init
git add .
git commit -m "Initial commit: full-stack expense tracker"
git branch -M main
git remote add origin https://github.com/<your-username>/expense-tracker.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, the Python virtual
environment, `db.sqlite3`, build artifacts, and any `.env` files, so nothing
sensitive or unnecessary is pushed.

## 17. Demonstrating CRUD End-to-End

1. Start the backend (`python manage.py runserver`) and frontend (`npm start`).
2. On the Dashboard, click **+ Add Expense**, fill the form, and submit —
   a success toast appears and the new expense shows in the table (**Create**).
3. The Dashboard table, summary cards, and category breakdown update live (**Read**).
4. Click **Edit** on any row, change a value, and save — the update is
   reflected immediately (**Update**).
5. Click **Delete**, confirm in the modal — the item disappears and totals
   recalculate (**Delete**).
6. Use the search box, category dropdown, and date pickers to filter results.

## 18. Validation Rules (Frontend + Backend)

| Rule                                         | Enforced In         |
|------------------------------------------------|----------------------|
| Title cannot be empty / must be ≥ 2 chars       | Frontend & Backend    |
| Amount must be > 0 (and realistically bounded)  | Frontend & Backend    |
| Category is required (fixed choice list)        | Frontend & Backend    |
| Date is required and cannot be in the future    | Frontend & Backend    |
| Payment method is required (fixed choice list)  | Frontend & Backend    |
| Description ≤ 1000 characters                   | Frontend & Backend    |
| Invalid/non-existent ID returns 404 with message | Backend               |

Server-side validation is the source of truth (via DRF serializers); the
frontend re-implements the same rules purely to give the user instant
feedback before the network round-trip.

## 19. Future Enhancements

- User authentication (multi-user accounts, JWT login)
- Recurring expenses and budget limits with alerts
- Export expenses to CSV/PDF
- Monthly/yearly charts (line & pie charts) using a charting library
- Multi-currency support
- Receipt image upload per expense
- Dark mode

---

**Author's note:** This project is structured for a college submission and
live demonstration — clone it, install the two dependency sets, run two
commands, and all CRUD operations work end-to-end out of the box.
