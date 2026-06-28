export function missingAuthSecret(): never {
  throw new Error("Missing NEXTAUTH_SECRET or AUTH_SECRET");
}
