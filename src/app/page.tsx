"use client";

import { useEffect } from "react";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import CyronIntro from "@/components/CyronIntro/CyronIntro";
import { useIntro } from "@/components/IntroContext";
import WaveRibbon from "@/components/WaveRibbon";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Faq from "@/components/sections/Faq";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const { introDone, finishIntro } = useIntro();

  // Keep the page at the top and unscrollable while the intro plays.
  useEffect(() => {
    if (introDone) return;
    const html = document.documentElement;
    const prevRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    html.style.overflow = "hidden";
    // safety net: never leave the page locked if the intro fails to report back
    const failsafe = window.setTimeout(finishIntro, 15000);
    return () => {
      clearTimeout(failsafe);
      html.style.overflow = "";
      history.scrollRestoration = prevRestoration;
    };
  }, [introDone, finishIntro]);

  return (
    <main id="main" className="flex-1">
      {/* hero + About share one wrapper so the ribbon can stay pinned until "Tools I build with" */}
      <div className="relative">
        <div className="relative">
          <CyronIntro onDone={finishIntro} style={undefined} />

          <div
            className={`absolute inset-x-0 bottom-[12%] z-[3] flex flex-col items-center gap-5 px-6 text-center transition-all duration-700 ${
              introDone
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <p className="max-w-xl text-sm whitespace-nowrap text-neutral-600 sm:text-base">
              Fast, modern web experiences — from idea to launch.
            </p>
            <Link
              href="#projects"
              className="press group inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-violet-500/30 transition-colors hover:bg-violet-700"
            >
              View My Work
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </Link>
          </div>
        </div>

        {/* ribbon: above the intro background, below its logo/wordmark and the page content;
            sticky inside a wrapper-tall layer, so it stays put while scrolling through
            About and Projects and then scrolls away upward when the wrapper ends */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div
            className="sticky top-0 h-[100svh]"
          >
            <WaveRibbon emerge />
          </div>
        </div>

        <About />
        <Projects />
      </div>

      <Services />
      <Process />
      <Faq />
      <Contact />
      <Footer />
    </main>
  );
}
