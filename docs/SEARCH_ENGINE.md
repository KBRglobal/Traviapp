# TRAVI Search Engine - Phase 1: Foundation

## Overview

A world-class, production-ready search engine built for the Traviapp platform. This Phase 1 implementation provides the foundation for a search system that could be a SaaS product by itself.

## ✨ Features

### Core Search Functionality
- **Full-Text Search**: PostgreSQL tsvector with GIN indexes for blazing-fast searches
- **Autocomplete**: Trigram-based prefix matching with < 10ms response time
- **Trending Searches**: Real-time trending queries from the last 24 hours
- **Recent Searches**: Personal search history saved locally
- **Entity Extraction**: Automatic detection of locations, prices, and categories

### User Experience
- **Global Keyboard Shortcut**: Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) from anywhere
- **Smart Suggestions**: Context-aware autocomplete with icons
- **Keyboard Navigation**: Arrow keys, Enter to select, Escape to close
- **Mobile-First**: Responsive design that works on all devices
- **RTL Support**: Full support for Hebrew and Arabic

### Performance
- **Caching**: Redis with automatic memory fallback
- **Auto-Indexing**: Content automatically indexed on create/update/delete
- **Efficient Queries**: Optimized PostgreSQL queries with proper indexes
- **Performance Targets**:
  - Autocomplete: < 10ms (with cache)
  - Full search: < 100ms
  - Reindex all: < 60s for ~1000 items

### Multi-Language Support
Supports 16 languages with automatic language detection:
- English, Arabic, Hebrew, Spanish, French, German, Italian, Portuguese
- Russian, Chinese, Japanese, Korean, Turkish, Polish, Dutch, Swedish

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ SearchModal  │  │ SearchInput  │  │SearchResults │      │
│  │  (Cmd+K)     │  │(Autocomplete)│  │ (Rendering)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                         API Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   /search    │  │ /autocomplete│  │  /trending   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Search Engine                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Search Engine │  │ Autocomplete │  │Query Processor│     │
│  │              │  │    Engine    │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Storage Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │    Redis     │  │   Indexer    │      │
│  │  (FTS + GIN) │  │   (Cache)    │  │(Auto-Index)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 📚 API Documentation

### Search Endpoint
```http
GET /api/search?q=burj+khalifa&type=attraction&locale=en&page=1&limit=20
```

**Query Parameters:**
- `q` (required): Search query string
- `locale` (optional): Language code (default: "en")
- `type` (optional): Content types (comma-separated: "hotel,attraction")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)
- `location` (optional): Filter by location
- `category` (optional): Filter by category

**Response:**
```json
{
  "results": [
    {
      "id": "...",
      "contentId": "...",
      "title": "Burj Khalifa",
      "snippet": "The tallest building in the world...",
      "type": "attraction",
      "url": "/attractions/burj-khalifa",
      "image": "https://...",
      "score": 0.95,
      "highlights": {
        "title": ["Burj", "Khalifa"],
        "content": ["tallest building"]
      },
      "metadata": {
        "rating": 4.8,
        "price": "AED 150",
        "location": "Downtown Dubai"
      }
    }
  ],
  "total": 42,
  "page": 1,
  "totalPages": 3,
  "query": {
    "original": "burj khalifa",
    "normalized": "burj khalifa",
    "language": "en",
    "intent": "attraction"
  },
  "responseTimeMs": 45
}
```

### Autocomplete Endpoint
```http
GET /api/search/autocomplete?q=bur&locale=en&limit=8
```

**Response:**
```json
{
  "suggestions": [
    {
      "text": "burj khalifa",
      "displayText": "Burj Khalifa",
      "type": "content",
      "url": "/attractions/burj-khalifa",
      "icon": "🎢",
      "score": 150
    }
  ]
}
```

### Trending Searches
```http
GET /api/search/trending?locale=en&limit=10
```

**Response:**
```json
{
  "trending": [
    "burj khalifa",
    "dubai mall",
    "palm jumeirah",
    "dubai marina",
    "desert safari"
  ]
}
```

### Admin: Reindex (Requires `canManageSettings`)
```http
POST /api/search/reindex
```

### Admin: Rebuild Autocomplete (Requires `canManageSettings`)
```http
POST /api/search/rebuild-autocomplete
```

### Admin: Analytics (Requires `canViewAnalytics`)
```http
GET /api/search/analytics?days=7
```

## 🗄️ Database Schema

### search_index
Main search index with denormalized content data.

```sql
CREATE TABLE search_index (
  id VARCHAR PRIMARY KEY,
  content_id VARCHAR NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_vector TEXT,
  content TEXT,
  content_vector TEXT,
  meta_description TEXT,
  locations TEXT[],
  prices TEXT[],
  categories TEXT[],
  content_type TEXT NOT NULL,
  locale VARCHAR(5) DEFAULT 'en',
  popularity INTEGER DEFAULT 0,
  quality INTEGER DEFAULT 50,
  freshness TIMESTAMP,
  search_terms TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_search_index_title_vector ON search_index 
  USING GIN (to_tsvector('english', title));
CREATE INDEX idx_search_index_content_vector ON search_index 
  USING GIN (to_tsvector('english', COALESCE(content, '')));
CREATE INDEX idx_search_index_title_trigram ON search_index 
  USING GIN (title gin_trgm_ops);
```

### search_suggestions
Pre-computed autocomplete suggestions.

```sql
CREATE TABLE search_suggestions (
  id VARCHAR PRIMARY KEY,
  term TEXT NOT NULL UNIQUE,
  display_text TEXT NOT NULL,
  type TEXT NOT NULL,
  target_url TEXT,
  target_id VARCHAR,
  icon TEXT,
  weight INTEGER DEFAULT 0,
  search_count INTEGER DEFAULT 0,
  locale VARCHAR(5) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_search_suggestions_term_trigram ON search_suggestions 
  USING GIN (term gin_trgm_ops);
```

### search_sessions
Search analytics and session tracking.

```sql
CREATE TABLE search_sessions (
  id VARCHAR PRIMARY KEY,
  session_id VARCHAR,
  user_id VARCHAR,
  query TEXT NOT NULL,
  normalized_query TEXT,
  locale VARCHAR(5),
  results_count INTEGER DEFAULT 0,
  clicked_results TEXT[],
  filters JSONB,
  response_time_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Setup & Installation

### 1. Run Database Migration

```bash
# Option 1: Using psql
psql $DATABASE_URL < migrations/add-search-engine-tables.sql

# Option 2: Using Drizzle
npm run db:push
```

### 2. Index Existing Content

After setting up, you need to index existing content:

```bash
# Make a POST request to the reindex endpoint (requires admin auth)
curl -X POST http://localhost:5000/api/search/reindex \
  -H "Cookie: your-session-cookie"
```

Or use the admin UI once available.

### 3. Test the Search

```bash
# Test main search
curl "http://localhost:5000/api/search?q=burj+khalifa"

# Test autocomplete
curl "http://localhost:5000/api/search/autocomplete?q=bur"

# Test trending
curl "http://localhost:5000/api/search/trending"
```

## 🎨 Usage Examples

### Using SearchModal Component

The SearchModal is automatically available globally via `Cmd+K` / `Ctrl+K`.

```tsx
import { SearchModal } from "@/components/search/SearchModal";

function MyComponent() {
  const [searchOpen, setSearchOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setSearchOpen(true)}>
        Open Search
      </button>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
```

### Using SearchInput Component

```tsx
import { SearchInput } from "@/components/search/SearchInput";

function MyComponent() {
  const [query, setQuery] = useState("");
  
  return (
    <SearchInput
      value={query}
      onChange={setQuery}
      onSearch={(q) => {
        // Handle search submission
        console.log("Searching for:", q);
      }}
      placeholder="Search..."
      showSuggestions={true}
    />
  );
}
```

### Using SearchResults Component

```tsx
import { SearchResults } from "@/components/search/SearchResults";

function SearchPage() {
  const { data, isLoading } = useQuery({
    queryKey: [`/api/search?q=${query}`],
  });
  
  return (
    <SearchResults
      results={data?.results || []}
      isLoading={isLoading}
      query={query}
    />
  );
}
```

## 🔧 Configuration

### Performance Tuning

Edit `server/cache.ts` to adjust cache TTLs:

```typescript
const CACHE_TTL = {
  short: 60,      // Autocomplete: 1 minute
  medium: 300,    // Search results: 5 minutes  
  long: 3600,     // Trending: 1 hour
};
```

### Search Ranking

Adjust ranking weights in `server/search/index.ts`:

```typescript
rank: sql<number>`
  (ts_rank(..., title) * 2.0) +  // Title match weight
  ts_rank(..., content) +         // Content match weight
  (${searchIndex.popularity} * 0.001) +  // Popularity weight
  (${searchIndex.quality} * 0.01)        // Quality weight
`
```

## 📊 Monitoring & Analytics

### View Search Metrics

```sql
-- Top searches
SELECT query, COUNT(*) as count
FROM search_sessions
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY query
ORDER BY count DESC
LIMIT 10;

-- Average response times
SELECT AVG(response_time_ms) as avg_time,
       MAX(response_time_ms) as max_time,
       MIN(response_time_ms) as min_time
FROM search_sessions
WHERE created_at > NOW() - INTERVAL '1 hour';

-- Zero-result queries
SELECT query, COUNT(*) as count
FROM search_sessions
WHERE results_count = 0
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY query
ORDER BY count DESC;
```

## 🔒 Security

### Rate Limiting

All admin endpoints are rate-limited:
- Reindex: 30 requests/minute
- Rebuild autocomplete: 30 requests/minute  
- Analytics: 100 requests/minute

### Authorization

Admin endpoints require specific permissions:
- `POST /api/search/reindex`: `canManageSettings`
- `POST /api/search/rebuild-autocomplete`: `canManageSettings`
- `GET /api/search/analytics`: `canViewAnalytics`

Public endpoints have no authentication requirements.

## 🐛 Troubleshooting

### Search Returns No Results

1. Check if content is indexed:
   ```sql
   SELECT COUNT(*) FROM search_index;
   ```

2. Trigger a reindex:
   ```bash
   curl -X POST /api/search/reindex
   ```

3. Check indexer logs:
   ```bash
   grep "Indexer" logs/server.log
   ```

### Autocomplete Not Working

1. Check if suggestions exist:
   ```sql
   SELECT COUNT(*) FROM search_suggestions;
   ```

2. Rebuild autocomplete index:
   ```bash
   curl -X POST /api/search/rebuild-autocomplete
   ```

### Slow Search Performance

1. Check database indexes:
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'search_index';
   ```

2. Analyze query performance:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM search_index
   WHERE to_tsvector('english', title) @@ plainto_tsquery('english', 'your query');
   ```

3. Check cache hit rate in logs

## 🚀 Future Enhancements

### Phase 2: Advanced Features
- Spell checking and "Did you mean?" suggestions
- Faceted search (filter by multiple criteria)
- Search within specific sections
- Advanced query operators (AND, OR, NOT, quotes)

### Phase 3: Semantic Search
- Vector embeddings for semantic similarity
- Neural search with transformers
- Multi-modal search (image + text)

### Phase 4: Personalization
- User-specific ranking
- Search history analysis
- Collaborative filtering
- A/B testing framework

### Phase 5: Analytics Dashboard
- Real-time search metrics
- Query performance visualization
- User behavior insights
- Conversion tracking

## 📝 License

This search engine is part of the Traviapp platform and is proprietary software.

## 🤝 Contributing

For questions or contributions, please contact the development team.

---

Built with ❤️ for Traviapp
