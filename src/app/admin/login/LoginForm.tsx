"use client";

import { loginSchema, type LoginFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="ad-card p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <p
            className="rounded-lg px-3 py-2.5 text-center text-sm font-medium"
            style={{ background: "rgba(234,84,85,.1)", color: "#ea5455" }}
            role="alert"
          >
            {error}
          </p>
        )}

        <label className="block">
          <span
            className="mb-1.5 block text-xs font-semibold"
            style={{ color: "var(--ad-muted)" }}
          >
            Email
          </span>
          <input
            type="email"
            autoComplete="username"
            className="ad-field"
            placeholder="admin@example.com"
            {...register("email")}
          />
          {errors.email && (
            <span className="mt-1 block text-xs" style={{ color: "#ea5455" }}>
              {errors.email.message}
            </span>
          )}
        </label>

        <label className="block">
          <span
            className="mb-1.5 block text-xs font-semibold"
            style={{ color: "var(--ad-muted)" }}
          >
            Password
          </span>
          <input
            type="password"
            autoComplete="current-password"
            className="ad-field"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <span className="mt-1 block text-xs" style={{ color: "#ea5455" }}>
              {errors.password.message}
            </span>
          )}
        </label>

        <button
          type="submit"
          className="ad-btn ad-btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
