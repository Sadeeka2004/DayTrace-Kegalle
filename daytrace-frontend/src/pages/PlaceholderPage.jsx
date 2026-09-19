import { Link } from "react-router";

function PlaceholderPage({ label, title, description }) {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-950 px-5 py-12 text-white">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl sm:p-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-teal-300">
          {label}
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {title}
        </h1>

        <p className="mx-auto mt-5 max-w-xl leading-8 text-slate-300">
          {description}
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-teal-400 px-7 font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-300/30"
        >
          Return Home
        </Link>
      </section>
    </main>
  );
}

export default PlaceholderPage;