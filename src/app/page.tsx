// src/app/page.tsx
import { requireAuth } from "@/lib/middleware/auth";

export default async function HomePage() {
  await requireAuth();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Welcome to HDAG Intro Call!</h1>
    </main>
  );
}
