import Reveal from "@/components/Reveal";

const SKILL_GROUPS = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Three.js", "Tailwind CSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "GraphQL", "Prisma", "PostgreSQL", "REST APIs"],
  },
  {
    category: "Tooling",
    skills: ["Git", "Docker", "Vercel", "Figma", "CI/CD"],
  },
];

const ICON_GRADIENTS = [
  "from-violet-500 to-indigo-500",
  "from-fuchsia-500 to-pink-500",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
];

const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => g.skills);

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-28 overflow-hidden px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            Skills
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            Tools I build with
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-500">
            A focused toolkit, kept current, chosen for reliability as much
            as capability.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {SKILL_GROUPS.map((group, gi) => (
            <Reveal key={group.category} delay={gi * 120}>
              <div className="glass h-full rounded-[32px] p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  {group.category}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {group.skills.map((skill, si) => (
                    <span
                      key={skill}
                      className="press cursor-default rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm shadow-neutral-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-600 hover:text-white hover:shadow-lg hover:shadow-violet-300/60"
                      style={{ transitionDelay: `${si * 15}ms` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Marquee of app-icon style tiles */}
      <Reveal className="mt-16">
        <div
          className="relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <div className="animate-marquee flex w-max gap-4 hover:[animation-play-state:paused]">
            {[...ALL_SKILLS, ...ALL_SKILLS].map((skill, i) => (
              <div key={i} className="flex w-24 flex-col items-center gap-2">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-[22px] bg-gradient-to-br ${ICON_GRADIENTS[i % ICON_GRADIENTS.length]} text-2xl font-bold text-white shadow-lg`}
                >
                  {skill.charAt(0)}
                </div>
                <span className="text-xs text-neutral-600">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
