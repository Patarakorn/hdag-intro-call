"use client";
import { PhoneOutgoing } from "lucide-react";
import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { useMe } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: me, isLoading, isError } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && me && !isError) {
      router.replace("/");
    }
  }, [me, isLoading, isError, router]);

  if (isLoading) return null;
  if (me && !isError) return null;

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-black text-white dark:bg-black dark:text-white">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 rounded-lg p-2">
              <PhoneOutgoing className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">HDAG Intro Call</h1>
              <p className="text-zinc-400">Harvard Undergraduate Data Analytics Club Research Tool</p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-zinc-900 relative hidden lg:block overflow-hidden shadow-2xl">
        <Image
          src="/HDAGLogo.png"
          alt="HDAG Logo"
          fill
          className="absolute inset-0 h-full w-full object-cover grayscale dark:grayscale mix-blend-luminosity"
          style={{ objectFit: "cover" }}
          priority
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(124,58,237,0.85) 0%, rgba(168,85,247,0.7) 30%, rgba(239,68,68,0.5) 55%, rgba(234,88,12,0.5) 75%, rgba(124,58,237,0.7) 100%)',
            filter: 'blur(10px) saturate(1.2) drop-shadow(0 0 40px rgba(168,85,247,0.3))',
            mixBlendMode: 'screen',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)'}} />
      </div>
    </div>
  );
}
