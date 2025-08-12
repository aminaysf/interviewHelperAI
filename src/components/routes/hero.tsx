import { Badge } from "@/components/ui/badge"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="container mx-auto px-4 md:px-8 pt-10 md:pt-14">
      <div className="grid gap-8 md:grid-cols-2 items-start">
       
        {/* Left: Callout */}
        <div className="relative">
          <div
            className={cn(
              "rounded-xl border bg-gradient-to-br from-emerald-50 via-white to-fuchsia-50",
              "p-6 md:p-8 shadow-sm",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Sparkles className="size-5" />
              </div>
              <div className="text-sm font-medium text-neutral-700">Powered by AI</div>
            </div>
            <h3 className="mt-4 text-2xl md:text-3xl font-semibold text-neutral-900">
              Interview helpers powered by AI
            </h3>
            <p className="mt-3 text-neutral-600">
              Get instant, role-aware interview guidance, suggested talking points, and polished sample answers to help
              you stand out.
            </p>
          </div>
        </div>

         {/* Right: Title and description */}
        <div className="space-y-5">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">New</Badge>
          <h1 id="hero-title" className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">
            Interview Helper AI
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed">
            Generate tailored interview questions and high‑quality sample answers using AI. Choose your role or field
            and get structured practice sessions that help you prepare with confidence.
          </p>

          <ul className="mt-4 space-y-3 text-neutral-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
              <span>{"Role-specific questions for software, data, product, and more."}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
              <span>{"Clear, AI-crafted sample answers with key points to cover."}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" />
              <span>{"Organized sessions, progress tracking, and bookmarking."}</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  )
}
