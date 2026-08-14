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
      <label className="grid gap-2 text-sm font-semibold text-foreground">
        Usuario o DNI
        <Input
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="Ingresa tu usuario o DNI"
          aria-invalid={Boolean(error)}
          disabled={isSubmitting}
          className="h-12 rounded-lg bg-background/80 text-foreground shadow-inner transition"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-foreground">
        Contraseña
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Ingresa tu contraseña"
          aria-invalid={Boolean(error)}
          disabled={isSubmitting}
          className="h-12 rounded-lg bg-background/80 text-foreground shadow-inner transition"
        />
      </label>

      {error ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium leading-5 text-destructive"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 h-12 rounded-lg bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
