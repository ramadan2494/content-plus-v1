# Clean Code Rules & Best Practices

This document outlines the coding standards and best practices for the Content Plus frontend project.

## 📋 Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [React/Next.js Best Practices](#reactnextjs-best-practices)
4. [Component Design](#component-design)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Styling Guidelines](#styling-guidelines)
8. [Testing Standards](#testing-standards)
9. [Performance Optimization](#performance-optimization)
10. [Security Best Practices](#security-best-practices)

## 🎯 General Principles

### SOLID Principles Application

#### 1. Single Responsibility Principle (SRP)
```typescript
// ❌ Bad: Component doing too much
const UserProfile = () => {
  // Fetching data
  // Rendering UI
  // Handling auth
  // Managing forms
};

// ✅ Good: Separated concerns
const UserProfile = () => {
  const { user } = useAuth();
  const { data } = useUserData(user.id);
  
  return <UserProfileView user={user} data={data} />;
};
```

#### 2. Open/Closed Principle (OCP)
```typescript
// ✅ Good: Extendable without modification
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  // Can add new variants without changing base component
};
```

#### 3. Liskov Substitution Principle (LSP)
```typescript
// ✅ Good: All button variants behave consistently
<Button onClick={handleClick}>Click me</Button>
<Button variant="secondary" onClick={handleClick}>Click me</Button>
<Button variant="ghost" onClick={handleClick}>Click me</Button>
```

#### 4. Interface Segregation Principle (ISP)
```typescript
// ❌ Bad: Bloated interface
interface User {
  id: string;
  email: string;
  password: string;
  searchHistory: SearchResult[];
  preferences: UserPreferences;
  analytics: Analytics;
}

// ✅ Good: Segregated interfaces
interface UserAuth {
  id: string;
  email: string;
}

interface UserProfile extends UserAuth {
  preferences: UserPreferences;
}

interface UserAnalytics extends UserAuth {
  searchHistory: SearchResult[];
  analytics: Analytics;
}
```

#### 5. Dependency Inversion Principle (DIP)
```typescript
// ✅ Good: Depend on abstractions
interface ISearchService {
  search(query: string): Promise<SearchResult[]>;
}

class SearchService implements ISearchService {
  async search(query: string): Promise<SearchResult[]> {
    // Implementation
  }
}

// Components depend on interface, not implementation
const SearchPage = ({ searchService }: { searchService: ISearchService }) => {
  // Use searchService
};
```

## 📘 TypeScript Guidelines

### 1. Always Define Types

```typescript
// ❌ Bad: Using 'any'
const handleSearch = (query: any) => {
  // ...
};

// ✅ Good: Explicit types
const handleSearch = (query: string): Promise<SearchResult[]> => {
  // ...
};
```

### 2. Use Interfaces for Objects

```typescript
// ✅ Good
interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  page?: number;
}

const performSearch = (request: SearchRequest): Promise<SearchResponse> => {
  // ...
};
```

### 3. Utilize Type Guards

```typescript
// ✅ Good
function isRAGResult(result: unknown): result is RAGResult {
  return (
    typeof result === 'object' &&
    result !== null &&
    'answer' in result &&
    'sources' in result
  );
}
```

### 4. Avoid Type Assertions

```typescript
// ❌ Bad
const user = data as User;

// ✅ Good
const user: User = validateUser(data);
```

## ⚛️ React/Next.js Best Practices

### 1. Component Organization

```typescript
// ✅ Good structure
import { FC } from 'react';
import { useCustomHook } from '@/hooks';
import { Button } from '@/components/ui';

interface ComponentProps {
  title: string;
  onAction: () => void;
}

export const Component: FC<ComponentProps> = ({ title, onAction }) => {
  // Hooks at the top
  const { data, isLoading } = useCustomHook();
  
  // Event handlers
  const handleClick = () => {
    onAction();
  };
  
  // Early returns
  if (isLoading) return <Loading />;
  
  // Main render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
};
```

### 2. Use Custom Hooks

```typescript
// ✅ Good: Extract logic into custom hooks
const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const search = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await SearchService.search({ query });
      setResults(data.results);
    } finally {
      setIsLoading(false);
    }
  }, [query]);
  
  return { query, setQuery, results, isLoading, search };
};
```

### 3. Memoization

```typescript
// ✅ Good: Memoize expensive computations
const filteredResults = useMemo(() => {
  return results.filter(result => 
    result.category === selectedCategory
  );
}, [results, selectedCategory]);

// ✅ Good: Memoize callbacks
const handleSearch = useCallback(() => {
  performSearch(query);
}, [query]);
```

## 🎨 Component Design

### 1. Props Interface

```typescript
// ✅ Good: Clear, documented props
interface SearchBarProps {
  /** Current search query */
  value: string;
  /** Callback when query changes */
  onChange: (value: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Loading state */
  isLoading?: boolean;
}
```

### 2. Component Composition

```typescript
// ✅ Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Search Results</CardTitle>
  </CardHeader>
  <CardContent>
    <SearchResults results={results} />
  </CardContent>
</Card>
```

### 3. Separation of Concerns

```typescript
// ✅ Good: Separate presentation and logic
// Logic component
const useSearchLogic = () => {
  const [query, setQuery] = useState('');
  // ... logic
  return { query, setQuery, results, isLoading };
};

// Presentation component
const SearchView: FC<SearchViewProps> = ({ query, setQuery, results }) => {
  return (
    // ... UI only
  );
};

// Container component
const SearchContainer = () => {
  const logic = useSearchLogic();
  return <SearchView {...logic} />;
};
```

## 🔄 State Management

### 1. Zustand Store Structure

```typescript
// ✅ Good: Clear store structure
interface SearchState {
  // State
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setQuery: (query: string) => void;
  performSearch: () => Promise<void>;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  isLoading: false,
  error: null,
  
  setQuery: (query) => set({ query }),
  
  performSearch: async () => {
    const { query } = get();
    set({ isLoading: true, error: null });
    
    try {
      const results = await SearchService.search({ query });
      set({ results, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  clearResults: () => set({ results: [], query: '' }),
}));
```

### 2. State Updates

```typescript
// ❌ Bad: Direct mutation
state.results.push(newResult);

// ✅ Good: Immutable updates
set({ results: [...state.results, newResult] });
```

## 🌐 API Integration

### 1. Service Layer

```typescript
// ✅ Good: Centralized API calls
export class SearchService {
  private static readonly BASE_PATH = '/v1/search';
  
  static async search(request: SearchRequest): Promise<SearchResponse> {
    const response = await apiClient.post<SearchResponse>(
      `${this.BASE_PATH}/${request.type}`,
      request
    );
    return response.data;
  }
  
  static async getFilters(): Promise<SearchFilters> {
    const response = await apiClient.get<SearchFilters>(
      `${this.BASE_PATH}/filters`
    );
    return response.data;
  }
}
```

### 2. Error Handling

```typescript
// ✅ Good: Comprehensive error handling
try {
  const results = await SearchService.search(request);
  return results;
} catch (error) {
  if (error instanceof ApiError) {
    // Handle API error
    showNotification(error.message);
  } else {
    // Handle unexpected error
    console.error('Unexpected error:', error);
    showNotification('An unexpected error occurred');
  }
  throw error;
}
```

## 🎨 Styling Guidelines

### 1. Tailwind CSS Classes

```tsx
// ✅ Good: Organized, readable classes
<div className={cn(
  // Layout
  'flex flex-col gap-4',
  // Spacing
  'p-6 m-4',
  // Appearance
  'bg-white dark:bg-gray-900',
  'rounded-lg shadow-md',
  // Conditional
  isActive && 'border-2 border-primary'
)} />
```

### 2. Component Variants

```typescript
// ✅ Good: Use class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white',
        outline: 'border border-input',
        ghost: 'hover:bg-accent',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

## 🧪 Testing Standards

### 1. Unit Tests

```typescript
// ✅ Good: Test components in isolation
describe('SearchBar', () => {
  it('calls onChange when input value changes', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar value="" onChange={onChange} />
    );
    
    const input = getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(onChange).toHaveBeenCalledWith('test');
  });
});
```

### 2. Integration Tests

```typescript
// ✅ Good: Test component interactions
describe('SearchPage', () => {
  it('displays results after search', async () => {
    const { getByPlaceholderText, findByText } = render(<SearchPage />);
    
    const input = getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.submit(input.closest('form')!);
    
    expect(await findByText('Test Result')).toBeInTheDocument();
  });
});
```

## ⚡ Performance Optimization

### 1. Code Splitting

```typescript
// ✅ Good: Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
});
```

### 2. Avoid Unnecessary Re-renders

```typescript
// ✅ Good: Memoize components
const SearchResult = React.memo<SearchResultProps>(({ result }) => {
  return <ResultCard result={result} />;
}, (prevProps, nextProps) => {
  return prevProps.result.id === nextProps.result.id;
});
```

### 3. Debouncing

```typescript
// ✅ Good: Debounce expensive operations
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    performSearch(query);
  }, 500),
  []
);
```

## 🔐 Security Best Practices

### 1. XSS Prevention

```tsx
// ❌ Bad: Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Good: Sanitize user input
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userInput) }} />
```

### 2. Secure Token Storage

```typescript
// ✅ Good: Secure token handling
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
  
  static isTokenExpired(token: string): boolean {
    const payload = parseJWT(token);
    return Date.now() >= payload.exp * 1000;
  }
}
```

### 3. Input Validation

```typescript
// ✅ Good: Validate with Zod
const searchSchema = z.object({
  query: z.string().min(2).max(200),
  filters: z.object({
    categories: z.array(z.string()).optional(),
  }).optional(),
});

const validateSearch = (data: unknown) => {
  return searchSchema.parse(data);
};
```

## 📝 Documentation

### 1. Component Documentation

```typescript
/**
 * SearchBar component for entering search queries
 * 
 * @param value - Current search query
 * @param onChange - Callback when query changes
 * @param onSearch - Callback when search is submitted
 * @param isLoading - Loading state indicator
 * 
 * @example
 * ```tsx
 * <SearchBar
 *   value={query}
 *   onChange={setQuery}
 *   onSearch={handleSearch}
 *   isLoading={false}
 * />
 * ```
 */
```

### 2. Complex Logic Documentation

```typescript
/**
 * Performs debounced search with the following logic:
 * 1. Waits for user to stop typing (500ms)
 * 2. Validates query length
 * 3. Calls search API
 * 4. Updates results state
 */
const debouncedSearch = useCallback(
  debounce((query: string) => {
    if (query.length >= MIN_QUERY_LENGTH) {
      performSearch(query);
    }
  }, DEBOUNCE_DELAY),
  []
);
```

## ✅ Code Review Checklist

- [ ] Types are properly defined
- [ ] Components follow single responsibility
- [ ] No unnecessary re-renders
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Accessibility attributes are present
- [ ] Code is properly documented
- [ ] Tests are written and passing
- [ ] No console.logs in production code
- [ ] Security best practices followed

---

**Remember**: Clean code is not just about following rules, but writing code that is easy to read, understand, and maintain for your team.
