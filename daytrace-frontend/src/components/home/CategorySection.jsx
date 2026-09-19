import {
  ArrowUpRight,
  Compass,
  Flower2,
  Landmark,
  Mountain,
  Palette,
  PawPrint,
} from "lucide-react";
import { Link } from "react-router";
import { categories } from "../../data/categories";

const categoryIcons = {
  mountain: Mountain,
  flower: Flower2,
  landmark: Landmark,
  palette: Palette,
  paw: PawPrint,
  compass: Compass,
};

function CategorySection() {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="bg-[#f4f8f7] px-5 py-20 sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-teal-700">
              Find your experience
            </p>

            <h2
              id="categories-heading"
              className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl"
            >
              Explore by category
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              Choose the type of place you would like to discover around
              Kegalle.
            </p>
          </div>

          <Link
            to="/places"
            className="inline-flex w-fit items-center gap-2 font-semibold text-teal-800 transition hover:text-teal-600"
          >
            View all attractions
            <ArrowUpRight size={19} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const CategoryIcon = categoryIcons[category.icon];

            return (
              <Link
                key={category.id}
                to={`/places?category=${category.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-950/10"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-teal-100/60 transition duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="mb-7 flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-900/15 transition duration-300 group-hover:rotate-3 group-hover:bg-teal-600">
                      <CategoryIcon
                        size={26}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-300 group-hover:border-teal-600 group-hover:bg-teal-600 group-hover:text-white">
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-950">
                    {category.name}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;