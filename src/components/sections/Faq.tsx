"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/Reveal";

const FAQS = [
  {
    q: "How long does a typical project take?",
    a: "A focused landing page or portfolio usually takes 1–2 weeks. A full web application is typically 4–10 weeks depending on scope. You get a clear timeline after our first call.",
  },
  {
    q: "How is pricing handled?",
    a: "I work with fixed-price quotes for well-defined projects and monthly retainers for ongoing work. Tell me about your project and you'll get a transparent estimate — no hidden costs.",
  },
  {
    q: "Which technologies do you use?",
    a: "Mostly Next.js, React, TypeScript, Node.js, GraphQL, Prisma and PostgreSQL, plus Three.js for 3D. I pick the simplest stack that fits your needs.",
  },
  {
    q: "Will my site work well on phones and rank on Google?",
    a: "Yes. Everything is built mobile-first, tested for accessibility and optimised for Core Web Vitals, with proper metadata and semantic markup for SEO.",
  },
  {
    q: "Do you offer support after launch?",
    a: "Yes. Every project includes a post-launch support window, and I'm available for maintenance, new features and performance work afterwards.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-28 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            FAQ
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            Good questions
          </h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 70}>
                <div className="glass overflow-hidden rounded-[28px]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold text-neutral-900 sm:text-lg">
                      {item.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 transition-transform duration-500 [transition-timing-function:var(--ease-spring)] ${
                        isOpen ? "rotate-[135deg]" : ""
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-500 [transition-timing-function:var(--ease-ios)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-neutral-600 sm:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
