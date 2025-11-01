# 📂 Content Plus Frontend - Directory Structure

```
frontend/
│
├── 📄 Configuration & Setup
│   ├── package.json                 # Dependencies and scripts
│   ├── tsconfig.json                # TypeScript configuration
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.ts           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   ├── .eslintrc.json               # ESLint rules
│   ├── .prettierrc                  # Prettier formatting rules
│   ├── .gitignore                   # Git ignore rules
│   ├── .env.example                 # Environment template
│   ├── .env.local                   # Environment variables (active)
│   └── install.sh                   # Installation script
│
├── 📚 Documentation
│   ├── README.md                    # Complete documentation (main)
│   ├── GET_STARTED.md               # Quick start guide (start here!)
│   ├── SETUP.md                     # Detailed setup instructions
│   ├── CLEAN_CODE_RULES.md          # Coding standards & best practices
│   ├── PROJECT_SUMMARY.md           # What's included & features
│   └── DIRECTORY_STRUCTURE.md       # This file
│
├── 📱 src/ (Source Code)
│   │
│   ├── 🎨 app/ (Next.js App Router - Pages)
│   │   ├── layout.tsx               # Root layout with fonts
│   │   ├── page.tsx                 # Home page (redirects to login/search)
│   │   ├── globals.css              # Global styles & Tailwind
│   │   │
│   │   ├── 🔐 login/
│   │   │   └── page.tsx             # Login page with validation
│   │   │
│   │   ├── 📝 register/
│   │   │   └── page.tsx             # Registration with password strength
│   │   │
│   │   ├── 🔍 search/
│   │   │   └── page.tsx             # Main search interface (5 types)
│   │   │
│   │   ├── 📊 dashboard/
│   │   │   └── page.tsx             # User dashboard & statistics
│   │   │
│   │   └── 📤 upload/
│   │       └── page.tsx             # Document upload (single & batch)
│   │
│   ├── 🧩 components/ (React Components)
│   │   ├── index.ts                 # Component exports
│   │   │
│   │   ├── 🎨 ui/ (Reusable UI Components)
│   │   │   ├── index.ts             # UI component exports
│   │   │   ├── button.tsx           # Button with variants
│   │   │   ├── input.tsx            # Form input field
│   │   │   ├── label.tsx            # Form label
│   │   │   ├── card.tsx             # Card container
│   │   │   ├── tabs.tsx             # Tabbed navigation
│   │   │   └── loading-spinner.tsx  # Loading indicator
│   │   │
│   │   ├── 🔍 search/ (Search Components)
│   │   │   ├── index.ts             # Search component exports
│   │   │   ├── SearchBar.tsx        # Search input with filters
│   │   │   ├── SearchTabs.tsx       # 5 search type tabs
│   │   │   ├── SearchResults.tsx    # Standard search results display
│   │   │   ├── RAGResults.tsx       # AI answer with sources
│   │   │   └── SearchFilters.tsx    # Category & database filters
│   │   │
│   │   ├── 🔐 auth/ (Authentication)
│   │   │   └── ProtectedRoute.tsx   # Route guard component
│   │   │
│   │   └── 📐 layout/ (Layout Components)
│   │       └── Header.tsx           # App header with navigation
│   │
│   ├── 🌐 services/ (API Service Layer)
│   │   ├── index.ts                 # Service exports
│   │   ├── auth.service.ts          # Authentication API calls
│   │   ├── search.service.ts        # Search API calls (5 types)
│   │   └── document.service.ts      # Document upload API calls
│   │
│   ├── 🗂️ store/ (State Management - Zustand)
│   │   ├── index.ts                 # Store exports
│   │   ├── auth.store.ts            # Auth state (user, token, login, logout)
│   │   └── search.store.ts          # Search state (query, results, filters)
│   │
│   ├── 📝 types/ (TypeScript Type Definitions)
│   │   ├── index.ts                 # Type exports
│   │   ├── auth.types.ts            # Auth types (User, LoginRequest, etc.)
│   │   ├── search.types.ts          # Search types (SearchRequest, SearchResult, etc.)
│   │   ├── document.types.ts        # Document types (UploadRequest, etc.)
│   │   └── api.types.ts             # API response types
│   │
│   ├── 🛠️ lib/ (Utilities & Libraries)
│   │   ├── utils.ts                 # Helper functions (cn, debounce, formatDate, etc.)
│   │   └── api/
│   │       └── axios-client.ts      # HTTP client with interceptors
│   │
│   └── ⚙️ config/ (Configuration)
│       └── constants.ts             # App constants (routes, API config, etc.)
│
└── 📦 public/ (Static Assets)
    └── (images, fonts, etc.)
```

---

## 🎯 Quick Navigation Guide

### Want to...

**Add a new page?**
→ `src/app/your-page/page.tsx`

**Create a UI component?**
→ `src/components/ui/your-component.tsx`

**Add a search feature?**
→ `src/components/search/your-feature.tsx`

**Call an API?**
→ `src/services/your-service.ts`

**Manage state?**
→ `src/store/your-store.ts`

**Define types?**
→ `src/types/your-types.ts`

**Add utilities?**
→ `src/lib/utils.ts`

**Configure app?**
→ `src/config/constants.ts`

**Change styles?**
→ `src/app/globals.css` or `tailwind.config.ts`

---

## 📊 File Count by Category

```
Configuration:      11 files
Documentation:      6 files
Pages:              7 files
UI Components:      8 files
Search Components:  5 files
Auth Components:    1 file
Layout Components:  1 file
Services:           4 files
Stores:             3 files
Types:              5 files
Utilities:          2 files
Config:             1 file
-----------------------------------
Total:              ~54+ files
```

---

## 🔍 Important Files

### Must Read First
1. `GET_STARTED.md` - Start here!
2. `README.md` - Complete documentation
3. `SETUP.md` - Setup instructions

### Configuration Files
1. `package.json` - Dependencies
2. `.env.local` - Environment variables
3. `tailwind.config.ts` - Styling

### Core Application Files
1. `src/app/search/page.tsx` - Main search page
2. `src/services/search.service.ts` - Search API
3. `src/store/search.store.ts` - Search state
4. `src/lib/api/axios-client.ts` - HTTP client

---

## 🎨 Component Hierarchy

```
App Layout (src/app/layout.tsx)
│
├── Home (src/app/page.tsx)
│   └── Redirects to Login or Search
│
├── Login (src/app/login/page.tsx)
│   ├── Card
│   ├── Input
│   ├── Button
│   └── Form Validation
│
├── Register (src/app/register/page.tsx)
│   ├── Card
│   ├── Input
│   ├── Button
│   └── Password Strength Indicator
│
├── Search (src/app/search/page.tsx)
│   ├── ProtectedRoute
│   ├── Header
│   ├── SearchTabs
│   ├── SearchBar
│   ├── SearchFilters
│   ├── SearchResults
│   └── RAGResults
│
├── Dashboard (src/app/dashboard/page.tsx)
│   ├── ProtectedRoute
│   ├── Header
│   └── Statistics Cards
│
└── Upload (src/app/upload/page.tsx)
    ├── ProtectedRoute
    ├── Header
    └── Upload Forms
```

---

## 📁 Module Organization

### By Feature
```
Authentication:
├── Pages:      src/app/login/, src/app/register/
├── Component:  src/components/auth/ProtectedRoute.tsx
├── Service:    src/services/auth.service.ts
├── Store:      src/store/auth.store.ts
└── Types:      src/types/auth.types.ts

Search:
├── Page:       src/app/search/page.tsx
├── Components: src/components/search/*
├── Service:    src/services/search.service.ts
├── Store:      src/store/search.store.ts
└── Types:      src/types/search.types.ts

Document Upload:
├── Page:       src/app/upload/page.tsx
├── Service:    src/services/document.service.ts
└── Types:      src/types/document.types.ts
```

---

## 🎯 Code Flow

### Search Flow
```
User Input (SearchBar.tsx)
    ↓
Debounce (500ms)
    ↓
Update Store (search.store.ts)
    ↓
Call Service (search.service.ts)
    ↓
API Call (axios-client.ts)
    ↓
Response Transform
    ↓
Update Results (search.store.ts)
    ↓
Display (SearchResults.tsx / RAGResults.tsx)
```

### Authentication Flow
```
Login Form (login/page.tsx)
    ↓
Validate (Zod Schema)
    ↓
Call Auth Store (auth.store.ts)
    ↓
API Call (auth.service.ts)
    ↓
Store Token (localStorage)
    ↓
Redirect to Search
    ↓
Protected Route Check
```

---

## 🗺️ Import Paths

```typescript
// Aliased imports (@/ = src/)
import { Button } from '@/components/ui';
import { useAuthStore } from '@/store';
import { SearchService } from '@/services';
import { SearchRequest } from '@/types';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/config/constants';
```

---

**This structure follows:**
- ✅ Clean Architecture principles
- ✅ Separation of concerns
- ✅ SOLID principles
- ✅ Feature-based organization
- ✅ Scalable patterns

**Navigate with confidence!** 🎯
