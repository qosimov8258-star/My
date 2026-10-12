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

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-28 bg-white px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            Skills
          </span>
          <h2 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
            Tools I build with
          </h2>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            A focused toolkit, kept current, chosen for reliability as much
            as capability.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.category}
              className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6"
            >
              <h3 className="text-sm font-semibold text-neutral-900">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm shadow-neutral-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
