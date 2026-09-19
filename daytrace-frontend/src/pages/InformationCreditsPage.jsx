import {
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Images,
  Map,
  ShieldCheck,
} from "lucide-react";

const informationSources = [
  {
    name: "Ambuluwawa Biodiversity Complex",
    url: "https://ambuluwawa.com/",
  },
  {
    name: "Department of National Zoological Gardens",
    url: "https://nationalzoo.gov.lk/pinnawala-zoo/",
  },
  {
    name: "Millennium Elephant Foundation",
    url: "https://millenniumelephantfoundation.com/",
  },
  {
    name: "Sabaragamuwa Province Tourism",
    url: "https://tourism.sg.gov.lk/",
  },
  {
    name: "Amazing Lanka",
    url: "https://amazinglanka.com/",
  },
  {
    name: "Unique Sri Lanka",
    url: "https://www.uniquesrilanka.com/",
  },
];

function InformationCreditsPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f4f8f7]">
      <section className="border-b border-slate-200 bg-white px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
            Transparency and responsible use
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Information &amp; Credits
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Learn how DayTrace Kegalle uses tourism information, map data and
            photographs within this university project.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <BookOpen size={27} className="text-teal-700" />

            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Information sources
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Attraction records are based on the approved project documents
              and publicly available tourism information. Details may change,
              so important information should be checked before travelling.
            </p>

            <ul className="mt-6 space-y-3">
              {informationSources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-semibold text-teal-800 transition hover:text-teal-600"
                  >
                    {source.name}
                    <ExternalLink size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <Map size={27} className="text-teal-700" />

            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Map data
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Interactive maps use Leaflet and map tiles provided by
              OpenStreetMap contributors. Locations and distances are shown as
              approximate planning information.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://leafletjs.com/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
              >
                Leaflet
              </a>

              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
              >
                OpenStreetMap contributors
              </a>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <Images size={27} className="text-teal-700" />

            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Photograph usage
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Development placeholders are used where final photographs are
              unavailable. Administrators should upload only original,
              permitted or appropriately licensed photographs and record
              credits where required.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <ShieldCheck size={27} className="text-teal-700" />

            <h2 className="mt-5 text-2xl font-bold text-slate-950">
              Project status
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              DayTrace Kegalle is an educational university project. It is not
              an official government, tourism-authority, attraction,
              emergency, booking, payment or navigation service.
            </p>
          </article>

          <article className="rounded-3xl border border-amber-200 bg-amber-50 p-6 md:col-span-2 sm:p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle
                size={25}
                className="mt-0.5 shrink-0 text-amber-700"
              />

              <div>
                <h2 className="text-xl font-bold text-amber-950">
                  Verify before travelling
                </h2>

                <p className="mt-3 leading-7 text-amber-900/80">
                  Opening hours, ticket prices, access routes, weather,
                  facilities and safety conditions may change. Confirm
                  important details with the relevant attraction or authority
                  before beginning a journey.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default InformationCreditsPage;