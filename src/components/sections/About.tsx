import { Code2, Layers, Sparkles } from "lucide-react";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const HIGHLIGHTS = [
  {
    icon: Code2,
    title: "Full-Stack Development",
    description:
      "End-to-end product builds with Next.js, TypeScript, and modern backend tooling.",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: Layers,
    title: "Interactive 3D & Motion",
    description:
      "Immersive, performant experiences powered by Three.js and WebGL.",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "Thoughtful Design Systems",
    description:
      "Clean, scalable UI built with Tailwind CSS and a focus on detail.",
    color: "from-sky-500 to-cyan-400",
  },
];

const STATS = [
  { to: 30, suffix: "+", label: "Projects shipped" },
  { to: 5, suffix: "+", label: "Years building" },
  { to: 10, suffix: "+", label: "Technologies" },
];

export default function About() {
  return (
    <section id="about" className="relative scroll-mt-28 overflow-x-clip px-4 py-24 sm:py-32">
      <div className="animate-blob pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="animate-blob pointer-events-none absolute -bottom-72 -right-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-sky-300/40 blur-3xl [animation-delay:-6s]" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            About
          </span>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            Building technology that feels{" "}
            <span className="text-gradient-anim bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
              effortless
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="glass h-full rounded-[32px] p-7 sm:p-10">
              <p className="text-lg leading-relaxed text-neutral-700 sm:text-xl">
                CyronTech is the studio behind modern, high-performance web
                experiences — from full-stack applications to interactive 3D
                interfaces. I focus on clean engineering, considered design,
                and products that hold up under real-world use.
              </p>
              <p className="mt-5 text-base leading-relaxed text-neutral-500">
                Every project starts with the same questions: what does this
                need to do well, and how do we make it feel simple? The answer
                usually involves a tight stack, careful performance budgets,
                and a lot of attention to the small details.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid h-full grid-cols-3 gap-3 lg:grid-cols-1">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="glass flex flex-col justify-center rounded-[28px] p-4 text-center sm:p-6 lg:text-left"
                >
                  <div className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-neutral-500 sm:text-sm">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {HIGHLIGHTS.map(({ icon: Icon, title, description, color }, i) => (
            <Reveal key={title} delay={i * 110}>
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
