"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");

    const formData = new FormData(event.currentTarget);
    const identifier = String(formData.get("identifier") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!identifier) {
      setError("Ingresa tu usuario o DNI.");
      return;
    }

    if (!password) {
      setError("Ingresa tu contraseña.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Usuario o contraseña incorrectos, o cuenta inactiva.");
        return;
      }

      if (result?.ok) {
        window.location.assign("/");
        return;
      }

      setError("No se pudo iniciar sesión. Intenta nuevamente.");
    } catch {
      setError("No se pudo iniciar sesión. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Usuario o DNI
        <Input
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="Ingresa tu usuario o DNI"
          aria-invalid={Boolean(error)}
          disabled={isSubmitting}
          className="h-12 rounded-lg border-slate-200 bg-white/[0.85] text-[#111827] shadow-inner shadow-slate-950/[0.03] transition focus-visible:border-[#DA291C] focus-visible:ring-[#DA291C]/20"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-slate-700">
        Contraseña
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          aria-invalid={Boolean(error)}
          disabled={isSubmitting}
          className="h-12 rounded-lg border-slate-200 bg-white/[0.85] text-[#111827] shadow-inner shadow-slate-950/[0.03] transition focus-visible:border-[#DA291C] focus-visible:ring-[#DA291C]/20"
        />
      </label>

      {error ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-[#DA291C]/20 bg-[#DA291C]/[0.08] px-3 py-2 text-sm font-medium leading-5 text-[#B91F15]"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-12 rounded-lg bg-[#DA291C] text-white shadow-[0_16px_30px_rgba(218,41,28,0.26)] transition hover:bg-[#B91F15] hover:shadow-[0_18px_36px_rgba(185,31,21,0.30)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
