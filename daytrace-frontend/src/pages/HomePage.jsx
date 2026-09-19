import FeaturedAttractionsSection from "../components/home/FeaturedAttractionsSection";
import { ArrowRight, CalendarDays, Map, MapPin, Search } from "lucide-react";
import { Link } from "react-router";
import CategorySection from "../components/home/CategorySection";
import heroImage from "../assets/images/hero-kegalle-placeholder.png";
import HeroSearchForm from "../components/home/HeroSearchForm";
import HowItWorksSection from "../components/home/HowItWorksSection";
import ScrollReveal from "../components/ui/ScrollReveal";
import HomeMapSection from "../components/home/HomeMapSection";

function HomePage() {
  return (
    <main>
      <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden bg-slate-950">
        <img
          src={heroImage}
          alt="Green mountain landscape representing tourism around Kegalle"
          className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />

        <div className="absolute inset-0 -z-20 bg-slate-950/35" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/10" />

        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center px-5 py-16 sm:px-8 lg:py-24">
          <div className="w-full max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-teal-100 shadow-lg backdrop-blur-md">
              <MapPin size={17} aria-hidden="true" />
              Discover attractions around Kegalle
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
              Discover hidden gems.
              <span className="block text-teal-300">
                Plan your perfect day.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              Explore nature, culture, history and wildlife attractions within
              25 km of Wilpola, Aranayake, and organize them into one simple
              day plan.
            </p>
            <HeroSearchForm />

            <div className="mt-5 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/places"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-teal-400 px-7 py-3.5 font-semibold text-slate-950 shadow-xl shadow-teal-950/30 transition duration-300 hover:-translate-y-1 hover:bg-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-300/40"
              >
                <Search size={19} aria-hidden="true" />
                Explore Places
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                to="/day-plan"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                <CalendarDays size={19} aria-hidden="true" />
                View My Day Plan
              </Link>
            </div>

            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-slate-950/35 p-4 backdrop-blur-md">
                <p className="text-2xl font-bold text-white">10+</p>
                <p className="mt-1 text-sm text-slate-300">
                  Local attractions
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-slate-950/35 p-4 backdrop-blur-md">
                <p className="text-2xl font-bold text-white">25 km</p>
                <p className="mt-1 text-sm text-slate-300">
                  Discovery radius
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-slate-950/35 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Map size={22} className="text-teal-300" aria-hidden="true" />
                  <p className="text-2xl font-bold text-white">1 Day</p>
                </div>

                <p className="mt-1 text-sm text-slate-300">
                  Simple visit planner
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-xs leading-5 text-slate-400">
              Travel details may change. Verify opening times, accessibility
              and current conditions before travelling.
            </p>
          </div>
        </div>
      </section>

      <ScrollReveal className="bg-white">
  <FeaturedAttractionsSection />
</ScrollReveal>

<ScrollReveal className="bg-[#f4f8f7]">
  <CategorySection />
</ScrollReveal>

<ScrollReveal className="bg-[#f4f8f7]">
  <HomeMapSection />
</ScrollReveal>

<ScrollReveal className="bg-slate-950">
  <HowItWorksSection />
</ScrollReveal>
    </main>
  );
}

export default HomePage;