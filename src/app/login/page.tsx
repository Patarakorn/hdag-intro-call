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
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-purple-600 text-white flex size-8 items-center justify-center rounded-md">
              <PhoneOutgoing className="size-6" />
            </div>
            <span>HDAG Intro Call</span>
          </a>
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-transparent to-purple-800/40 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)'}} />
      </div>
    </div>
  );
}
