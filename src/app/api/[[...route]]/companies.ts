import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { requireAuth } from "@/lib/middleware/requireAuth";
import OpenAI from "openai";

// Schema for query parameters
const searchQuerySchema = z.object({
  q: z.string().min(1, "Company name is required").max(100, "Company name too long"),
});

const app = new Hono()
  .get("/search", 
    requireAuth, 
    zValidator("query", searchQuerySchema), // Validate query parameters
    async (c) => {
      const { q: companyName } = c.req.valid("query"); // Type-safe validated data
      
      try {
        const companyData = await fetchCompanyDataWithOpenAI(companyName);
        return c.json({ ok: true, data: companyData });
      } catch (error) {
        console.error("Company search error:", error);
        return c.json({ ok: false, error: "Failed to fetch company data" }, 500);
      }
    }
  );

export default app;

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function fetchCompanyDataWithOpenAI(companyName: string) {
  try {
    // Use OpenAI to generate intelligent company data based on the company name
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a company research assistant. Based on the company name provided, generate realistic company information and analytics opportunities. 

          For the company "${companyName}", create:
          
          1. Realistic company information (industry, size, founded year, headquarters, detailed description)
          2. 5 specific data analytics opportunities with detailed explanations based on the company's characteristics
          
          Return ONLY valid JSON in this exact format:
          {
            "companyInfo": {
              "name": "Company Name",
              "industry": "Industry",
              "size": "Employee count or range",
              "founded": "Year founded",
              "headquarters": "City, Country",
              "description": "Provide a comprehensive, detailed description of the company including their business model, main products/services, target market, competitive advantages, recent developments, and market position. Make this at least 3-4 sentences long with specific details about what makes this company unique.",
              "revenue": "Revenue info if available",
              "website": "Website URL"
            },
            "analyticsPoints": [
              {
                "header": "Analytics Opportunity Title",
                "description": "Detailed explanation of why this opportunity exists based on the company's specific characteristics (industry, size, business model, etc.). Include specific data sources the company likely has and what a data analytics club with skills in data science, data analytics, data pipelining, and web development could build for them. Make this 2-3 sentences explaining the business value and technical approach."
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Generate comprehensive information for "${companyName}". Make it realistic and industry-appropriate.`
        }
      ],
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No response from OpenAI");
    }

    // Try to extract JSON from the response
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse JSON response");
    }

    const companyData = JSON.parse(jsonMatch[0]);
    
    // Validate the response structure
    if (!companyData.companyInfo || !companyData.analyticsPoints) {
      throw new Error("Invalid response structure from OpenAI");
    }

    return companyData;

  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Company data is not available at this time. Please try again later.");
  }
}



 