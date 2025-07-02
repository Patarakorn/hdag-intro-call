// src/app/page.tsx
import { requireAuth } from "@/lib/middleware/auth";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  await requireAuth();
  return <HomeClient />;
}
