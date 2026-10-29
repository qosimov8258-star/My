import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="px-4 pb-10 text-neutral-500">
      <div className="mx-auto max-w-6xl border-t border-neutral-300/60 pt-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <p className="text-lg font-semibold tracking-tight text-neutral-900">
              {SITE.name}
            </p>
            <p className="mt-2 text-sm leading-relaxed">{SITE.description}</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm transition-colors hover:text-violet-600"
              >
                {link.label}
              </Link>
            ))}
            <a href={`mailto:${SITE.email}`} className="text-sm transition-colors hover:text-violet-600">
              {SITE.email}
            </a>
          </nav>
        </div>
        <p className="mt-10 text-xs">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
