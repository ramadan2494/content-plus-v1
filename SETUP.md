# Content Plus Frontend - Quick Setup Guide

## ⚡ Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

This will install:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)
- React Hook Form + Zod (forms & validation)
- Lucide React (icons)

### Step 2: Environment Setup
The `.env.local` file is already configured with:
```env
NEXT_PUBLIC_API_BASE_URL=https://content-plus-core.medadstg.com
NEXT_PUBLIC_DEFAULT_TENANT=_default
```

### Step 3: Run Development Server
```bash
npm run dev
```

Open **http://localhost:3000**

### Step 4: Login
Use these test credentials:
```
Email: admin@gmail.com
Password: admin123
```

## 🎯 What You Get

### ✅ Complete Features
1. **Authentication System**
   - Login & Registration pages
   - JWT token management
   - Protected routes
   - Auto token refresh

2. **5 Search Types**
   - Fuzzy Search
   - Exact Match
   - Partial Match
   - Semantic Search (AI-powered)
   - RAG Search (AI answers with sources)

3. **Advanced UI**
   - Responsive design (mobile, tablet, desktop)
   - Dark mode support
   - Loading states
   - Error handling
   - Search filters (categories, databases)

4. **Document Management**
   - Single document upload
   - Batch upload (CSV/JSON)
   - Drag & drop interface

5. **Dashboard**
   - User profile
   - Search history
   - Usage statistics

## 📁 Project Structure
```
src/
├── app/              # Next.js pages
│   ├── login/       # Login page
│   ├── register/    # Registration
│   ├── search/      # Main search
│   ├── dashboard/   # User dashboard
│   └── upload/      # Document upload
├── components/      # React components
│   ├── ui/         # Reusable UI (Button, Input, Card, etc.)
│   ├── auth/       # Auth components
│   ├── layout/     # Header, Footer
│   └── search/     # Search components
├── services/       # API services
│   ├── auth.service.ts
│   ├── search.service.ts
│   └── document.service.ts
├── store/          # Zustand stores
│   ├── auth.store.ts
│   └── search.store.ts
├── types/          # TypeScript types
├── lib/            # Utilities
└── config/         # Constants
```

## 🔑 Key Files

### Authentication
- `src/services/auth.service.ts` - Login/Register API calls
- `src/store/auth.store.ts` - Auth state management
- `src/app/login/page.tsx` - Login UI
- `src/app/register/page.tsx` - Registration UI

### Search
- `src/services/search.service.ts` - Search API calls
- `src/store/search.store.ts` - Search state
- `src/app/search/page.tsx` - Main search page
- `src/components/search/*` - Search components

### API Integration
- `src/lib/api/axios-client.ts` - HTTP client with interceptors
- Automatic JWT token attachment
- Error handling
- Request/response transformation

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🎨 UI Components

All components are in `src/components/ui/`:

```tsx
// Button
<Button variant="default">Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Input
<Input type="text" placeholder="Enter text" />

// Card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Tabs
<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content</TabsContent>
</Tabs>
```

## 🔍 API Endpoints Used

```typescript
// Authentication
POST /v1/auth/login
POST /v1/auth/register

// Search
POST /v1/search/fuzzy
POST /v1/search/exact
POST /v1/search/partial
POST /v1/search/semantic
POST /v1/search/rag

// Filters
POST /v1/search/filters

// Documents
POST /v1/documents/upload
POST /v1/documents/batch
```

## 🎯 Core Concepts

### 1. State Management (Zustand)
```typescript
// Usage in components
const { user, login, logout } = useAuthStore();
const { query, results, performSearch } = useSearchStore();
```

### 2. Type Safety
```typescript
// All data is typed
interface SearchRequest {
  query: string;
  filters?: SearchFilters;
}

interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  // ...
}
```

### 3. Service Layer
```typescript
// API calls are centralized
const results = await SearchService.search({
  query: 'machine learning',
  type: 'semantic'
});
```

## 🚨 Common Issues & Solutions

### Issue: Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Issue: TypeScript errors
```bash
# Check TypeScript configuration
npm run type-check
```

## 📝 Next Steps

1. **Explore the Code**
   - Check `src/app/search/page.tsx` for main search interface
   - Look at `src/components/search/` for search components
   - Review `src/services/` for API integration

2. **Customize**
   - Modify colors in `tailwind.config.ts`
   - Update constants in `src/config/constants.ts`
   - Add new components in `src/components/`

3. **Extend**
   - Add new search filters
   - Implement search history
   - Add bookmarks feature
   - Create user preferences

## 📚 Documentation

- **README.md** - Complete project documentation
- **CLEAN_CODE_RULES.md** - Coding standards and best practices

## 🤝 Architecture

### SOLID Principles Applied
- **S**ingle Responsibility: Each service handles one concern
- **O**pen/Closed: Components extensible via props
- **L**iskov Substitution: Consistent component interfaces
- **I**nterface Segregation: Focused type definitions
- **D**ependency Inversion: Services abstracted

### Design Patterns
- **Singleton**: API client
- **Factory**: Component variants
- **Observer**: Zustand state
- **Strategy**: Search types
- **Repository**: Service layer

## 💡 Pro Tips

1. **Use TypeScript autocomplete** - Let VS Code help you!
2. **Check component props** - Hover over components to see available props
3. **Use search** - Cmd/Ctrl + P to quickly find files
4. **Debugging** - Use React DevTools browser extension
5. **State inspection** - Install Zustand DevTools

## 🎓 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

## ✅ Checklist

- [x] Dependencies installed
- [x] Environment configured
- [x] Dev server running
- [x] Login successful
- [ ] Explore search features
- [ ] Try different search types
- [ ] Test filters
- [ ] Upload a document

---

**Happy Coding! 🚀**

For questions or issues, check the main README.md or open an issue.
