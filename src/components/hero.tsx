import Link from "next/link";
import { Triangle } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[--border] py-20 sm:py-28 lg:py-36">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs text-[--muted] border border-[--border] rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              New collection available
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Gear built for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
                those who ship.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[--muted] max-w-md mx-auto lg:mx-0 mb-8">
              Minimal. Functional. Vercel. Shop the official collection of
              developer swag crafted for the modern builder.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-white text-black font-medium text-sm px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Shop now
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-medium text-sm px-6 py-3 rounded-lg border border-[--border] hover:bg-[--card-hover] transition-colors"
              >
                View all products
              </Link>
            </div>
          </div>

          {/* Visual element */}
          <div className="relative flex-shrink-0">
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border border-[--border] flex items-center justify-center">
              <div className="w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full border border-[--border] flex items-center justify-center">
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border border-[--border] flex items-center justify-center">
                  <Triangle className="w-16 h-16 sm:w-20 sm:h-20 fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
