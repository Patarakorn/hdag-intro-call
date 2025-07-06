import { requireAuth } from "@/lib/middleware/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await requireAuth();
    
    // Check if user is admin - only exact match with environment variable
    const isAdmin = user.email === process.env.ADMIN_EMAIL;
    
    if (!isAdmin) {
      redirect("/");
    }
    
    return <>{children}</>;
  } catch {
    redirect("/login");
  }
} 