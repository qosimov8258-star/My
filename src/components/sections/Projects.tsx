import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";

const PROJECTS = [
  {
    title: "Vista Academy",
    description:
      "Landing page for a kindergarten network in Andijan — age-based groups from 2 months to 12 years, open hours, meals, and a gentle adaptation process for new children.",
    tags: ["Landing page", "Kindergarten"],
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    href: "https://vista-academy.uz/",
  },
  {
    title: "Zeeron",
    description:
      "A management platform for kindergartens, with a dedicated panel for running day-to-day operations in one place.",
    tags: ["Web platform", "Kindergarten"],
    gradient: "from-emerald-500 via-teal-500 to-sky-500",
    href: "https://platform.zeeron.uz/",
  },
  {
    title: "Pulse Analytics",
    description:
      "A real-time analytics dashboard streaming live product metrics through GraphQL subscriptions.",
    tags: ["GraphQL", "React", "WebSockets", "Tailwind CSS"],
    gradient: "from-fuchsia-500 via-pink-500 to-orange-400",
  },
  {
    title: "Configurator 3D",
    description:
      "An interactive, WebGL-powered product configurator that renders and customizes 3D models in the browser.",
    tags: ["Three.js", "WebGL", "TypeScript", "Next.js"],
    gradient: "from-sky-500 via-cyan-400 to-emerald-400",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-28 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            Projects
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            Selected work
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-500">
            A few projects that show how I like to build — fast, considered,
            and built to last.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={i * 130}>
              <TiltCard className="h-full rounded-[32px] shadow-xl shadow-neutral-300/40 transition-shadow duration-500 hover:shadow-2xl hover:shadow-violet-300/50">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press flex h-full flex-col overflow-hidden rounded-[32px] bg-white"
                >
                  <div
                    className={`relative h-48 overflow-hidden bg-gradient-to-br ${project.gradient}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_60%)]" />
                    <div className="animate-float absolute -bottom-6 -right-6 h-32 w-32 rounded-[36px] bg-white/25 backdrop-blur-sm" />
                    <div className="animate-float absolute left-8 top-8 h-14 w-14 rounded-2xl bg-white/30 backdrop-blur-sm [animation-delay:-3s]" />
                    <div className="glass absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full">
                      <ArrowUpRight className="h-4 w-4 text-neutral-800 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                      {project.title === "Zeeron" ? (
                        <span className="text-2xl font-extrabold tracking-tight text-neutral-900">
                          Z<span className="text-[#9b2335]">ee</span>
                          <span className="text-[#c8922e]">r</span>on
                        </span>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
                      {project.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
