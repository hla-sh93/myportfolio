import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "./LoginForm";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin");

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-base font-black text-white"
            style={{ background: "var(--accent)" }}
          >
            HS
          </span>
          <h1 className="text-lg font-bold">Portfolio admin</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ad-muted)" }}>
            Sign in to manage content.
          </p>
        </div>

        <AdminLoginForm />
      </div>
    </div>
  );
}
