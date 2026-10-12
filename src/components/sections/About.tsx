import { Code2, Layers, Sparkles } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description:
      "End-to-end product builds with Next.js, TypeScript, and modern backend tooling.",
  },
  {
    icon: Layers,
    title: "Interactive 3D & Motion",
    description:
      "Immersive, performant experiences powered by Three.js and WebGL.",
  },
  {
    icon: Sparkles,
    title: "Thoughtful Design Systems",
    description:
      "Clean, scalable UI built with Tailwind CSS and a focus on detail.",
  },
];

export default function About() {
  return (
    <section id="about" className="scroll-mt-28 bg-white px-4 py-24">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            About
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
            Building technology that feels effortless
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-600">
            CyronTech is the studio behind modern, high-performance web
            experiences — from full-stack applications to interactive 3D
            interfaces. I focus on clean engineering, considered design, and
            products that hold up under real-world use.
          </p>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            Every project starts with the same questions: what does this need
            to do well, and how do we make it feel simple? The answer usually
            involves a tight stack, careful performance budgets, and a lot of
            attention to the small details.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-neutral-200 pt-8">
            <Stat value="30+" label="Projects shipped" />
            <Stat value="5+" label="Years building" />
            <Stat value="10+" label="Technologies" />
          </div>
        </div>

        <div className="space-y-5">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm shadow-neutral-100 transition-colors hover:border-violet-200 hover:bg-violet-50/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-neutral-900">{value}</div>
      <div className="mt-1 text-xs text-neutral-500">{label}</div>
    </div>
  );
}
