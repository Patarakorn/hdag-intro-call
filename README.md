# HDAG Intro Call - Harvard Undergraduate Data Analytics Club Research Tool

This is a [Next.js](https://nextjs.org) project for the Harvard Undergraduate Data Analytics Club (HDAG) that provides company research and analytics opportunities identification.

## Features

- **Company Search**: Search for companies and get comprehensive information
- **Analytics Opportunities**: Identify potential data analytics projects for companies
- **Case Study Matching**: Find relevant past case studies
- **Admin Panel**: Manage users and case documents
- **Authentication**: Secure login system
- **Session Caching**: Search results and content are cached for one hour after login for a seamless experience
- **Instruction Page**: Clear user instructions are provided in-app

## How It Works

### Login & Session Caching
- Sign in to access company search and analytics features.
- After logging in, your search results and content are cached for **one hour**.
- You can move between pages and refresh the site—your cached search results will persist for up to one hour after login.
- Logging out will immediately clear all cached content and search results.

### Company Search Tips
- To search, simply enter the **company name** in the search bar.
- If multiple companies share the same name, you can specify the **country** or **industry** for more accurate results (e.g., "Acme Corp, USA, Technology").
- Partial names and keywords are supported, but more details help improve search accuracy.

### What You Get After Searching
- **Company Profile**: Name, industry, size, founding year, headquarters, description, revenue, and website.
- **Analytics Opportunities**: A list of tailored analytics project ideas and opportunities relevant to the company and its industry.
- **Past Case Studies**: If available, relevant case studies and project summaries from the HDAG database.
- All information is generated using advanced AI and curated data sources for accuracy and insight.

### Security & Privacy
- Your session and search data are private and only accessible to you while logged in.
- Cached content is automatically deleted after one hour or upon logout.

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- OpenAI API key

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES=1h  # e.g., 1h for one hour session expiry

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
ADMIN_EMAIL=admin@example.com

# OpenAI (for company search)
OPENAI_API_KEY=your_openai_api_key

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**All of the following environment variables must be set:**
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES`
- `NEXT_PUBLIC_ADMIN_EMAIL`
- `ADMIN_EMAIL`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_API_URL`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Company Search API

The application uses OpenAI's GPT-4 to generate intelligent company information and analytics opportunities. The API:

- Generates detailed company profiles with comprehensive descriptions
- Identifies industry-specific analytics opportunities with detailed explanations
- Provides specific project ideas for data analytics clubs
- Returns an error message if company data is not available

### API Response Structure

```json
{
  "companyInfo": {
    "name": "Company Name",
    "industry": "Industry",
    "size": "Employee count",
    "founded": "Year",
    "headquarters": "Location",
    "description": "Detailed company description",
    "revenue": "Revenue info",
    "website": "Website URL"
  },
  "analyticsPoints": [
    {
      "header": "Opportunity Title",
      "description": "Detailed explanation of the opportunity and what can be built"
    }
  ]
}
```

### API Endpoints

- `GET /api/companies/search?q=companyName` - Search for company information

## Admin Panel

The admin panel allows privileged users to manage PDF case documents and user access.

### Setup
- Set both `NEXT_PUBLIC_ADMIN_EMAIL` (frontend) and `ADMIN_EMAIL` (backend) in your `.env.local` to the same admin email address.
- Only users with this email will have access to the admin panel.

### Access Logic
- The admin panel is accessible only to users whose email exactly matches the `NEXT_PUBLIC_ADMIN_EMAIL` environment variable.
- Logic is enforced in both the frontend (`src/components/HomeClient.tsx`) and backend (`src/app/admin/layout.tsx`).

### Features
- **PDF File Management**: Upload and manage PDF documents
- **Email Database**: Add and manage email addresses for user access
- **Toast Notifications**: Real-time feedback using Sonner toast library
- **Responsive Design**: Works on desktop and mobile devices
- **Shadcn UI Components**: Uses official shadcn/ui table and sonner components

### Security
- Admin access is protected by authentication middleware
- Only authenticated users with admin privileges can access `/admin`
- Non-admin users are redirected to the home page
- Unauthenticated users are redirected to the login page

---

## Similar Cases API

The Similar Cases API finds the top 5 most similar past cases based on vector embeddings of company information.

### Endpoint
- `POST /api/cases/similar` with JSON body:
  ```json
  {
    "companyInfo": "Apple Inc - Technology industry",
    "limit": 5
  }
  ```

#### Request Body
- `companyInfo` (required): String containing company information to search for similar cases
- `limit` (optional): Number of results to return (default: 5)

#### Example Response
```json
{
  "ok": true,
  "data": [
    {
      "id": "case_id_1",
      "filename": "apple_analytics_case.pdf",
      "extractedText": "This case study examines Apple's customer behavior patterns...",
      "uploadedAt": "2024-01-15T10:30:00Z",
      "similarity": 0.85
    }
  ]
}
```

### How It Works
1. **Input Processing**: The API takes company information as a string input
2. **Embedding Generation**: Uses OpenAI's text-embedding-3-small model to generate a vector embedding for the input text
3. **Database Query**: Retrieves all case documents that have existing vector embeddings
4. **Similarity Calculation**: Calculates cosine similarity between the input vector and each case document's vector
5. **Ranking**: Sorts cases by similarity score (highest first) and returns the top results

### Frontend Integration
- The frontend uses the `useSimilarCases` hook from `src/lib/api/cases.ts`:
  ```typescript
  const { data, isLoading, error } = useSimilarCases(companyInfo, 5);
  ```
- The `SimilarCasesCard` component displays the results with loading states, error handling, similarity score badges, truncated text, and formatted dates.

### Database Requirements
- The `CaseDocument` model must have:
  - `vector` field: Array of numbers (OpenAI embedding)
  - `filename`: String
  - `extractedText`: String
  - `uploadedAt`: Date

### Error Handling & Performance
- Returns 500 error if embedding generation or database query fails
- Returns empty array if no cases with embeddings exist
- Caches results for 5 minutes (staleTime), keeps cache for 10 minutes (gcTime)
- Disables refetching on window focus/mount/reconnect
- Limits results to prevent performance issues



## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
