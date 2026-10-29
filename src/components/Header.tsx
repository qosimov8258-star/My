"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useIntro } from "@/components/IntroContext";
import { NAV_LINKS } from "@/lib/site";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { introDone } = useIntro();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) io.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-3 z-50 px-4 transition-all duration-700 [transition-timing-function:var(--ease-ios)] ${
        introDone
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-6 opacity-0"
      }`}
    >
      <div
        className={`glass-dark mx-auto flex items-center justify-between gap-3 rounded-full py-2 pl-2 pr-2 transition-all duration-500 [transition-timing-function:var(--ease-ios)] ${
          scrolled ? "max-w-3xl" : "max-w-4xl"
        }`}
      >
        <Link
          href="/"
          aria-label="Home"
          className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
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

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-1.5 text-sm transition-all duration-300 ${
                active === link.href
                  ? "bg-white/15 text-white"
                  : "text-white/65 hover:bg-white/8 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#contact"
          className="press hidden shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-black md:inline-block"
        >
          Contact me
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-5 rounded bg-white transition-transform duration-300 ${
                isMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rounded bg-white transition-opacity ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 block h-0.5 w-5 rounded bg-white transition-transform duration-300 ${
                isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="glass-dark animate-pop mx-auto mt-2 flex max-w-4xl flex-col gap-1 rounded-[28px] p-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`press rounded-2xl px-4 py-3 text-base transition-colors ${
                active === link.href
                  ? "bg-white/15 text-white"
                  : "text-white/75 active:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="press mt-2 rounded-full bg-white px-4 py-3 text-center text-base font-medium text-black"
          >
            Contact me
          </Link>
        </nav>
      )}
    </header>
  );
}
