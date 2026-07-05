"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { changePasswordAction, type ChangePasswordState } from "@/actions/password";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChangePasswordFormProps = {
  fullName: string;
  identifier: string;
};

export function ChangePasswordForm({
  fullName,
  identifier,
}: ChangePasswordFormProps) {
  const [state, setState] = useState<ChangePasswordState | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setState(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await changePasswordAction(formData);

    if (result.status === "error") {
      setState(result);
      setIsSubmitting(false);
      return;
    }

    const signInResult = await signIn("credentials", {
      identifier,
      password: newPassword,
      redirect: false,
    });

    if (signInResult?.ok) {
      window.location.assign("/");
      return;
    }

    setState({
      status: "error",
      message:
        "La contrasena fue cambiada, pero no se pudo actualizar la sesion. Cierra sesion e ingresa nuevamente.",
    });
    setIsSubmitting(false);
  }

  return (
    <section className="mx-auto w-full max-w-lg rounded-xl border border-white/10 bg-white/[0.08] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur sm:p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
          Seguridad de cuenta
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Cambiar contrasena
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Hola {fullName}. Actualiza tu contrasena temporal para continuar.
        </p>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <PasswordField
          disabled={isSubmitting}
          error={fieldError(state, "currentPassword")}
          label="Contrasena actual"
          name="currentPassword"
          autoComplete="current-password"
        />
        <PasswordField
          disabled={isSubmitting}
          error={fieldError(state, "newPassword")}
          label="Nueva contrasena"
          name="newPassword"
          autoComplete="new-password"
          onChange={setNewPassword}
          value={newPassword}
        />
        <PasswordField
          disabled={isSubmitting}
          error={fieldError(state, "confirmPassword")}
          label="Confirmar nueva contrasena"
          name="confirmPassword"
          autoComplete="new-password"
        />

        {state?.message ? (
          <p
            aria-live="polite"
            className={
              state.status === "success"
                ? "rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-200"
                : "rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-3 py-2 text-sm font-semibold text-[#FFB4AC]"
            }
          >
            {state.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 bg-[#DA291C] text-white hover:bg-[#B91F15]"
          >
            {isSubmitting ? "Actualizando..." : "Actualizar contrasena"}
          </Button>
          <SignOutButton />
        </div>
      </form>
    </section>
  );
}

function PasswordField({
  disabled,
  error,
  label,
  name,
  autoComplete,
  onChange,
  value,
}: {
  autoComplete: string;
  disabled: boolean;
  error?: string;
  label: string;
  name: string;
  onChange?: (value: string) => void;
  value?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      <Input
        name={name}
        type="password"
        autoComplete={autoComplete}
        required
        minLength={8}
        disabled={disabled}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        aria-invalid={Boolean(error)}
        className="h-11 border-white/10 bg-[#111827]/70 text-white placeholder:text-slate-500"
      />
      {error ? <span className="text-xs font-medium text-[#FFB4AC]">{error}</span> : null}
    </label>
  );
}

function fieldError(state: ChangePasswordState | null, field: string) {
  return state?.errors?.[field]?.[0];
}
