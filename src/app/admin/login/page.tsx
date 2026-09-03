"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, key }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Unable to sign in.");
      }
      router.push("/admin/orders");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-16">
      <form onSubmit={submit} className="mx-auto max-w-md rounded-[28px] border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bf4800]">SFH Admin</p>
        <h1 className="mt-3 text-3xl font-bold text-stone-900">Sign in to order management</h1>
        <div className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-stone-700">Admin email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" /></label>
          <label className="block text-sm font-semibold text-stone-700">Access key<input required type="password" value={key} onChange={(event) => setKey(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3" /></label>
        </div>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button disabled={loading} className="mt-6 w-full rounded-full bg-[#bf4800] px-5 py-3 font-semibold text-white disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
      </form>
    </main>
  );
}
