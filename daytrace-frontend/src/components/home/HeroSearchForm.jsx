import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";

function HeroSearchForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedSearchQuery = searchQuery.trim();

    if (!normalizedSearchQuery) {
      navigate("/places");
      return;
    }

    const searchParameters = new URLSearchParams({
      search: normalizedSearchQuery,
    });

    navigate(`/places?${searchParameters.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="mt-8 max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl shadow-slate-950/30 backdrop-blur-xl"
    >
      <label htmlFor="hero-place-search" className="sr-only">
        Search attractions
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />

          <input
            id="hero-place-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search a place, category or location..."
            autoComplete="off"
            className="min-h-13 w-full rounded-xl border border-transparent bg-white py-3 pl-12 pr-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-300/20"
          />
        </div>

        <button
          type="submit"
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-teal-400 px-6 font-bold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-300/40"
        >
          <Search size={18} aria-hidden="true" />
          Search
        </button>
      </div>
    </form>
  );
}

export default HeroSearchForm;