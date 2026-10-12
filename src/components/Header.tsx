"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useIntro } from "@/components/IntroContext";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { introDone } = useIntro();

  return (
    <header
      className={`fixed inset-x-0 top-4 z-50 px-4 transition-all duration-700 ${
        introDone
          ? "translate-y-0 opacity-100"
          : "-translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 rounded-full border border-white/10 bg-[#2a1250]/95 py-2 pl-2 pr-2 shadow-lg shadow-purple-950/40 backdrop-blur-md">
        <Link
          href="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
        >
          <Image
            src="/logo/logo.png"
            alt="Logo"
            width={504}
            height={616}
            priority
            className="h-5 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#contact"
          className="hidden shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 md:inline-block"
        >
          Contact me
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-5 bg-white transition-transform ${
                isMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 bg-white transition-opacity ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 block h-0.5 w-5 bg-white transition-transform ${
                isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="mx-auto mt-2 flex max-w-4xl flex-col gap-1 rounded-3xl border border-white/10 bg-[#2a1250]/95 p-4 shadow-lg shadow-purple-950/40 backdrop-blur-md md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 rounded-full bg-white px-4 py-2 text-center text-sm font-medium text-black"
          >
            Contact me
          </Link>
        </nav>
      )}
    </header>
  );
}
