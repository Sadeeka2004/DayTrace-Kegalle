import {
  ArrowRight,
  CalendarCheck,
  ListOrdered,
  Search,
} from "lucide-react";
import { Link } from "react-router";

const journeySteps = [
  {
    number: "01",
    title: "Explore attractions",
    description:
      "Search and filter verified attractions by place name, category or location.",
    icon: Search,
  },
  {
    number: "02",
    title: "Choose your places",
    description:
      "Open destination details, view photos and add suitable places to your day plan.",
    icon: CalendarCheck,
  },
  {
    number: "03",
    title: "Arrange your journey",
    description:
      "Move selected attractions into your preferred visit order and review the final timeline.",
    icon: ListOrdered,
  },
];

function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white sm:px-8 lg:py-28"
    >
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-300">
            Simple journey planning
          </p>

          <h2
            id="how-it-works-heading"
            className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl"
          >
            Plan your day in three steps
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
            DayTrace keeps local trip planning clear and focused without
            booking, payment or unnecessary features.
          </p>
        </div>

        <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
          <div className="absolute left-[16.66%] right-[16.66%] top-14 hidden h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent lg:block" />

          {journeySteps.map((step) => {
            const StepIcon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:bg-white/[0.09]"
              >
                <div className="flex items-center justify-between">
                  <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400 text-slate-950 shadow-xl shadow-teal-950/30 transition duration-300 group-hover:rotate-3 group-hover:bg-teal-300">
                    <StepIcon size={25} aria-hidden="true" />
                  </span>

                  <span className="text-4xl font-black text-white/10">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-300">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/places"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-400 px-7 font-bold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-300/30"
          >
            Start exploring
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;