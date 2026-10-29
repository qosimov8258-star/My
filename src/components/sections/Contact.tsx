import { Mail, Phone, Send } from "lucide-react";
import type { SVGProps } from "react";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12.02c0 5.03 3.26 9.29 7.79 10.8.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.17.69-3.84-1.35-3.84-1.35-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.33.95.1-.74.4-1.25.73-1.54-2.53-.29-5.19-1.27-5.19-5.63 0-1.24.44-2.26 1.17-3.06-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.17 1.82 1.17 3.06 0 4.37-2.67 5.33-5.21 5.62.41.36.77 1.06.77 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.21.66.79.55A10.53 10.53 0 0 0 23.5 12.02C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "GitHub", href: SITE.github, icon: GithubIcon },
  { label: "LinkedIn", href: SITE.linkedin, icon: LinkedinIcon },
];

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-28 px-4 pb-24 pt-8 sm:pb-32">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-[#2a1250] px-6 py-16 text-white sm:px-12 sm:py-24">
          <div className="animate-blob pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-violet-600/50 blur-3xl" />
          <div className="animate-blob pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-fuchsia-500/40 blur-3xl [animation-delay:-7s]" />

          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <span className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-white/80">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 [animation:pulseRing_2s_ease-out_infinite]" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available for new projects
              </span>
              <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
                Let&apos;s build something together
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/60">
                Tell me about your idea. I reply {SITE.responseTime} with
                questions, a rough plan and a transparent estimate.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:${SITE.email}`}
                  className="press inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
                >
                  <Mail className="h-4 w-4" />
                  {SITE.email}
                </a>
                <a
                  href={`tel:${SITE.phone}`}
                  className="press inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
                >
                  <Phone className="h-4 w-4" />
                  {SITE.phone}
                </a>
                <a
                  href={`https://t.me/${SITE.telegram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="press inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20"
                >
                  <Send className="h-4 w-4" />@{SITE.telegram}
                </a>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="press glass-dark flex h-12 w-12 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="glass-dark rounded-[32px] p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
