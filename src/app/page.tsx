"use client";

import { ArrowDown } from "lucide-react";
import Link from "next/link";
import CyronIntro from "@/components/CyronIntro/CyronIntro";
import { useIntro } from "@/components/IntroContext";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const { introDone, finishIntro } = useIntro();

  return (
    <main className="flex-1">
      <div className="relative">
        <CyronIntro onDone={finishIntro} style={undefined} />

        <div
          className={`absolute inset-x-0 bottom-[12%] flex flex-col items-center gap-5 px-6 text-center transition-all duration-700 ${
            introDone
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <p className="max-w-xl text-base whitespace-nowrap text-neutral-600">
            Fast, modern web experiences — from idea to launch.
          </p>
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            View My Work
            <ArrowDown className="h-4 w-4" />
          </Link>
        </div>
      </div>


      <About />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}
