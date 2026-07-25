import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "./LoginForm";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-accent tracking-tighter mb-2">
            PORTFOLIO<span className="text-text-primary">ADMIN</span>
          </h1>
          <p className="text-text-secondary">Sign in to manage your portfolio</p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
