import Reveal from "@/components/Reveal";

const STEPS = [
  {
    title: "Discover",
    description:
      "We talk through your goals, users and constraints, and agree on scope, timeline and success metrics.",
  },
  {
    title: "Design",
    description:
      "Wireframes and a clickable prototype so you can see and feel the product before a line of code is written.",
  },
  {
    title: "Build",
    description:
      "Iterative development with regular demos. You see working software every week, not a surprise at the end.",
  },
  {
    title: "Launch & Grow",
    description:
      "Deployment, monitoring and hand-over — plus ongoing support and improvements when you need them.",
  },
];

export default function Process() {
  return (
    <section id="process" className="scroll-mt-28 px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
            Process
          </span>
          <h2 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
            How we work together
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-500">
            A simple, transparent process — you always know what happens next.
          </p>
        </Reveal>

        <ol className="relative mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <li className="glass relative h-full list-none rounded-[32px] p-7">
                <span className="text-gradient-anim bg-gradient-to-br from-violet-600 via-fuchsia-500 to-sky-500 bg-clip-text text-6xl font-bold tracking-tighter text-transparent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
