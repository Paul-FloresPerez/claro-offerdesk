"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
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
      setError("Ingresa tu usuario o correo.");
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
        router.replace("/");
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
        Usuario o correo
        <Input
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="juan, paul o correo registrado"
          aria-invalid={Boolean(error)}
          disabled={isSubmitting}
          className="h-11 border-slate-200 bg-slate-50 text-[#111827]"
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
          className="h-11 border-slate-200 bg-slate-50 text-[#111827]"
        />
      </label>

      {error ? (
        <p
          aria-live="polite"
          className="rounded-md border border-[#DA291C]/20 bg-[#DA291C]/8 px-3 py-2 text-sm font-medium text-[#B91F15]"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-11 bg-[#DA291C] text-white shadow-[0_12px_24px_rgba(218,41,28,0.18)] hover:bg-[#B91F15]"
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
