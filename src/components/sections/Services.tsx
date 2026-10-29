import { Boxes, Gauge, Globe, Palette, ServerCog, ShoppingCart } from "lucide-react";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const SERVICES = [
  {
    icon: Globe,
    title: "Websites & Web Apps",
    description:
      "Fast, accessible, SEO-ready sites and full applications built with Next.js and TypeScript.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Boxes,
    title: "3D & Interactive",
    description:
      "Hero animations, product configurators and WebGL experiences that make visitors stop scrolling.",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description:
      "Headless storefronts with real-time inventory, secure checkout and a smooth path to purchase.",
    color: "from-orange-500 to-amber-400",
  },
  {
    icon: ServerCog,
    title: "APIs & Backend",
    description:
      "GraphQL and REST APIs, databases and integrations designed to scale with your product.",
    color: "from-sky-500 to-cyan-400",
  },
  {
    icon: Palette,
    title: "UI/UX & Design Systems",
    description:
      "Clean interfaces and reusable component systems that keep your product consistent as it grows.",
    color: "from-emerald-500 to-teal-400",
  },
  {
    icon: Gauge,
    title: "Performance & SEO",
    description:
      "Audits and fixes for Core Web Vitals, accessibility and search visibility — measurable results.",
    color: "from-rose-500 to-red-400",
  },
];

export default function Services() {
  return (
    <section id="services" className="scroll-mt-28 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            Services
          </span>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            What I can build for you
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-500">
            From a sharp landing page to a complete product — one person,
            end to end, no hand-offs.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description, color }, i) => (
            <Reveal key={title} delay={(i % 3) * 110}>
              <TiltCard className="glass h-full rounded-[32px] p-7 transition-shadow duration-500 hover:shadow-2xl hover:shadow-violet-200/60">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br ${color} text-white shadow-lg`}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-neutral-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {description}
                </p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
