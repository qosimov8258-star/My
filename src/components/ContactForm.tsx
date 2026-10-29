"use client";

import { Check, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { SITE } from "@/lib/site";

const TYPES = ["Website", "Web app", "E-commerce", "3D / Interactive", "Other"];
const BUDGETS = ["Under $1k", "$1k – $5k", "$5k – $15k", "$15k+", "Not sure yet"];

const field =
  "w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-base text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-violet-300 focus:bg-white/15 focus:ring-4 focus:ring-violet-400/20";

/** Builds a pre-filled email — works without a backend, opens the visitor's mail app. */
export default function ContactForm() {
  const [type, setType] = useState(TYPES[0]);
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Record<string, string> = {};
    if (name.length < 2) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email";
    if (message.length < 10) next.message = "Tell me a bit more (10+ characters)";
    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = `New ${type} project — ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nProject type: ${type}\nBudget: ${budget}\n\n${message}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="animate-pop flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-semibold">Almost there!</h3>
        <p className="max-w-sm text-white/60">
          Your email app should have opened with the message ready. Just press
          send — I reply {SITE.responseTime}.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="press mt-2 text-sm text-violet-300 underline-offset-4 hover:underline"
        >
          Edit message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 text-left">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Name</span>
          <input name="name" autoComplete="name" placeholder="Jane Doe" className={field} aria-invalid={!!errors.name} />
          {errors.name && <span className="mt-1.5 block text-sm text-rose-300">{errors.name}</span>}
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="jane@company.com" className={field} aria-invalid={!!errors.email} />
          {errors.email && <span className="mt-1.5 block text-sm text-rose-300">{errors.email}</span>}
        </label>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm text-white/70">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => setType(t)}
              className={`press rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                type === t ? "bg-white text-black" : "bg-white/10 text-white/75 hover:bg-white/20"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm text-white/70">Budget</legend>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={budget === b}
              onClick={() => setBudget(b)}
              className={`press rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                budget === b ? "bg-violet-500 text-white" : "bg-white/10 text-white/75 hover:bg-white/20"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-2 block text-sm text-white/70">Project details</span>
        <textarea name="message" rows={5} placeholder="What are you building, and what does success look like?" className={`${field} resize-none`} aria-invalid={!!errors.message} />
        {errors.message && <span className="mt-1.5 block text-sm text-rose-300">{errors.message}</span>}
      </label>

      <button
        type="submit"
        className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-medium text-black shadow-xl shadow-black/20 sm:w-auto"
      >
        Send message
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
