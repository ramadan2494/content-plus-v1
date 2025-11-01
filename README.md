# Content Plus - AI-Powered Academic Search Platform

A modern, production-ready React/Next.js frontend application for Content Plus - an AI-powered academic document search and RAG (Retrieval-Augmented Generation) platform.

## 🌟 Features

- **Multiple Search Types**: Fuzzy, Exact, Partial, Semantic, and RAG search
- **AI-Powered RAG**: Get AI-generated answers with cited sources
- **Advanced Filtering**: Filter by categories, databases, dates, and authors
- **Real-time Search**: Debounced search with instant results
- **Modern UI**: Clean, responsive design with dark mode support
- **Type-Safe**: Full TypeScript implementation
- **Authentication**: JWT-based authentication with automatic token refresh
- **Document Upload**: Single and batch document upload capabilities

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Navigate to project directory
cd frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://content-plus-core.medadstg.com
NEXT_PUBLIC_DEFAULT_TENANT=_default
NEXT_PUBLIC_APP_NAME=Content Plus
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js 14 App Router pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── search/            # Main search interface
│   │   ├── dashboard/         # User dashboard
│   │   ├── upload/            # Document upload
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── label.tsx
│   │   │   └── loading-spinner.tsx
│   │   ├── auth/              # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/            # Layout components
│   │   │   └── Header.tsx
│   │   └── search/            # Search-related components
│   │       ├── SearchBar.tsx
│   │       ├── SearchTabs.tsx
│   │       ├── SearchResults.tsx
│   │       ├── RAGResults.tsx
│   │       └── SearchFilters.tsx
│   ├── lib/                   # Utility libraries
│   │   ├── api/               # API client configuration
│   │   │   └── axios-client.ts
│   │   └── utils.ts           # Helper functions
│   ├── services/              # API service layer
│   │   ├── auth.service.ts    # Authentication API
│   │   ├── search.service.ts  # Search API
│   │   ├── document.service.ts # Document API
│   │   └── index.ts
│   ├── store/                 # Zustand state management
│   │   ├── auth.store.ts      # Auth state
│   │   ├── search.store.ts    # Search state
│   │   └── index.ts
│   ├── types/                 # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── search.types.ts
│   │   ├── document.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   └── config/                # Configuration files
│       └── constants.ts       # App constants
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies and scripts
```

## 🔑 Authentication

### Login

Default credentials for testing:
```
Email: admin@gmail.com
Password: admin123
```

### API Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is automatically attached to all API requests via Axios interceptors
5. Protected routes check authentication status

## 🔍 Search Types

### 1. Fuzzy Search
- Approximate matching
- Handles typos and variations
- Good for broad searches

### 2. Exact Match
- Precise text matching
- Case-sensitive
- Best for specific queries

### 3. Partial Match
- Substring matching
- Flexible searching
- Useful for partial information

### 4. Semantic Search
- AI-powered meaning-based search
- Understands context and intent
- Returns semantically similar results

### 5. RAG (Retrieval-Augmented Generation)
- AI-generated answers
- Provides sources and citations
- Confidence scoring
- Best for question-answering

## 🎨 UI Components

Built with **shadcn/ui** and **Tailwind CSS**:

- `Button` - Customizable buttons with variants
- `Input` - Form input fields
- `Card` - Container component
- `Tabs` - Tabbed navigation
- `Label` - Form labels
- `LoadingSpinner` - Loading indicator

## 📡 API Integration

### Base Configuration

```typescript
API Base URL: https://content-plus-core.medadstg.com
Default Tenant: _default
```

### Example API Calls

```typescript
// Login
POST /v1/auth/login
Body: { email, password }

// Search
POST /v1/search/semantic
Headers: {
  Authorization: Bearer {token}
  x-content-plus-tenant: _default
}
Body: { query }

// RAG Search
POST /v1/search/rag
Body: { query }
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Format code
npm run format
```

## 🏗️ Architecture & Design Patterns

### SOLID Principles

1. **Single Responsibility Principle**
   - Each service handles one concern (AuthService, SearchService, DocumentService)
   - Components have single, well-defined purposes

2. **Open/Closed Principle**
   - Components are open for extension via props
   - Base UI components can be extended without modification

3. **Liskov Substitution Principle**
   - All search components implement consistent interfaces
   - Button variants maintain same base behavior

4. **Interface Segregation Principle**
   - Type definitions are split by domain (auth, search, document)
   - Components receive only needed props

5. **Dependency Inversion Principle**
   - Components depend on abstractions (interfaces/types)
   - Services are injected rather than hard-coded

### Design Patterns Used

- **Singleton**: API client instance
- **Factory**: Component variants (Button, Card)
- **Observer**: Zustand state management
- **Strategy**: Multiple search type implementations
- **Repository**: Service layer abstraction

## 🔐 Security

- JWT token authentication
- Secure token storage
- Automatic token refresh
- Protected route guards
- XSS prevention
- CSRF protection

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Optimized for all screen sizes

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Code Quality

### ESLint Rules
- TypeScript strict mode
- React hooks rules
- No unused variables
- Consistent code style

### Prettier Configuration
- 2-space indentation
- Single quotes
- Semicolons
- 100 character line width

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Frontend Development Team
- Backend API Team
- UI/UX Design Team

## 📞 Support

For support, email support@contentplus.com or open an issue in the repository.

## 🔄 Changelog

### Version 1.0.0 (Current)
- Initial release
- Full authentication system
- 5 search types implemented
- RAG search with AI-generated answers
- Document upload functionality
- Responsive UI with dark mode
- TypeScript support
- Complete API integration

## 🎯 Roadmap

- [ ] Advanced search history
- [ ] Bookmark/save documents
- [ ] Export search results
- [ ] User preferences
- [ ] Collaborative features
- [ ] Mobile app
- [ ] API rate limiting display
- [ ] Advanced analytics

---

**Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS**
