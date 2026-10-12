import { ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    title: "Nova Commerce",
    description:
      "A headless e-commerce platform with real-time inventory, server-rendered storefronts, and a custom checkout flow.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Stripe"],
    gradient: "from-violet-400 via-purple-400 to-indigo-400",
  },
  {
    title: "Pulse Analytics",
    description:
      "A real-time analytics dashboard streaming live product metrics through GraphQL subscriptions.",
    tags: ["GraphQL", "React", "WebSockets", "Tailwind CSS"],
    gradient: "from-fuchsia-400 via-violet-400 to-sky-400",
  },
  {
    title: "Configurator 3D",
    description:
      "An interactive, WebGL-powered product configurator that renders and customizes 3D models in the browser.",
    tags: ["Three.js", "WebGL", "TypeScript", "Next.js"],
    gradient: "from-purple-400 via-violet-500 to-indigo-500",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-28 bg-neutral-50 px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            Projects
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
            Selected work
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            A few projects that show how I like to build — fast, considered,
            and built to last.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm shadow-neutral-100 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-100"
            >
              <div
                className={`relative h-36 bg-gradient-to-br ${project.gradient}`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-neutral-900">
                    {project.title}
                  </h3>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-neutral-400 transition-colors group-hover:text-violet-600" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
