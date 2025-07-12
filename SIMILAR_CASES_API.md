# Similar Cases API

This document describes the new similar cases API that finds the top 5 most similar past cases based on vector embeddings.

## API Endpoint

### GET /api/cases/similar

Finds the top 5 most similar past cases based on company information using vector similarity search.

#### Query Parameters

- `companyInfo` (required): String containing company information to search for similar cases
- `limit` (optional): Number of results to return (default: 5)

#### Example Request

```bash
GET /api/cases/similar?companyInfo=Apple%20Inc%20-%20Technology%20industry&limit=5
```

#### Response Format

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
    },
    {
      "id": "case_id_2", 
      "filename": "tech_company_analysis.pdf",
      "extractedText": "Analysis of technology company data analytics implementation...",
      "uploadedAt": "2024-01-10T14:20:00Z",
      "similarity": 0.72
    }
  ]
}
```

## How It Works

1. **Input Processing**: The API takes company information as a string input
2. **Embedding Generation**: Uses OpenAI's text-embedding-3-small model to generate a vector embedding for the input text
3. **Database Query**: Retrieves all case documents that have existing vector embeddings
4. **Similarity Calculation**: Calculates cosine similarity between the input vector and each case document's vector
5. **Ranking**: Sorts cases by similarity score (highest first) and returns the top results

## Technical Details

### Cosine Similarity

The similarity between two vectors is calculated using cosine similarity:

```
similarity = (A · B) / (||A|| × ||B||)
```

Where:
- A · B is the dot product of vectors A and B
- ||A|| and ||B|| are the magnitudes of vectors A and B

### Vector Embeddings

- Uses OpenAI's `text-embedding-3-small` model
- Generates 1536-dimensional vectors
- Stored in the `CaseDocument` model's `vector` field

## Frontend Integration

The frontend uses the `useSimilarCases` hook from `src/lib/api/cases.ts`:

```typescript
const { data, isLoading, error } = useSimilarCases(companyInfo, 5);
```

The `SimilarCasesCard` component displays the results with:
- Loading states with skeleton components
- Error handling
- Similarity score badges with color coding
- Truncated text display
- Formatted dates

## Database Requirements

The `CaseDocument` model must have:
- `vector` field: Array of numbers (OpenAI embedding)
- `filename`: String
- `extractedText`: String  
- `uploadedAt`: Date

## Error Handling

- Returns 500 error if embedding generation fails
- Returns 500 error if database query fails
- Returns empty array if no cases with embeddings exist
- Handles malformed JSON responses from OpenAI

## Performance Considerations

- Caches results for 5 minutes (staleTime)
- Keeps cache for 10 minutes (gcTime)
- Disables refetching on window focus/mount/reconnect
- Uses efficient cosine similarity calculation
- Limits results to prevent performance issues 