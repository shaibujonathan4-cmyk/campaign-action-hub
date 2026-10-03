import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="min-h-screen bg-slate-950 text-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="text-xl font-bold tracking-tight">
            ADC <span className="text-blue-400">Campaign Action</span>
          </div>

          <Link
            href="/get-involved"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
          >
            Get Involved
          </Link>
        </nav>

        <div className="mx-auto flex max-w-7xl flex-col justify-center px-6 pb-24 pt-24 lg:min-h-[80vh] lg:flex-row lg:items-center lg:gap-20">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
              CONCEPT DEMO · NOT AN OFFICIAL ADC PLATFORM
            </div>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Turn willingness into action.
              <span className="block text-blue-400">
                Give every volunteer a clear next step.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Connect your time, skills, and location with real activities
              where your contribution can be organized, assigned, and tracked.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/get-involved"
                className="rounded-xl bg-blue-500 px-7 py-4 text-center font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
              >
                Find Where I Can Help →
              </Link>

              <Link
                href="/opportunities"
                className="rounded-xl border border-slate-700 px-7 py-4 text-center font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
              >
                Explore Activities
              </Link>
            </div>

            <p className="mt-5 text-sm text-slate-500">
              Tell us what you can contribute. We’ll help connect you with an
              activity that fits.
            </p>
          </div>

          <div className="mt-16 w-full max-w-xl lg:mt-0">
            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                src="/atiku-adc-demo.jpg"
                alt="Atiku Abubakar"
                className="h-[420px] w-full object-cover object-top sm:h-[500px]"
              />

              <div className="p-6">
                <p className="text-sm font-medium text-slate-400">
                  Your participation journey
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    ["01", "Choose how to help"],
                    ["02", "Find an activity"],
                    ["03", "Get assigned"],
                    ["04", "Complete & verify"],
                  ].map(([number, text]) => (
                    <div
                      key={number}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <span className="text-sm font-bold text-blue-400">
                        {number}
                      </span>
                      <p className="mt-2 text-sm font-medium text-slate-200">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
