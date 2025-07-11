# HDAG Intro Call - Harvard Undergraduate Data Analytics Club Research Tool

This is a [Next.js](https://nextjs.org) project for the Harvard Undergraduate Data Analytics Club (HDAG) that provides company research and analytics opportunities identification.

## Features

- **Company Search**: Search for companies and get comprehensive information
- **Analytics Opportunities**: Identify potential data analytics projects for companies
- **Case Study Matching**: Find relevant past case studies
- **Admin Panel**: Manage users and case documents
- **Authentication**: Secure login system

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

# OpenAI (for company search)
OPENAI_API_KEY=your_openai_api_key

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
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
- `POST /api/companies/search` - Search with JSON body

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
