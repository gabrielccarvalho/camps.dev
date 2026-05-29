import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@workspace/ui/components/button"

import { Container } from "@/components/container"

function Hero() {
  return (
    <section className="relative h-[calc(100svh-4rem)] w-full overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 h-[42rem] w-[42rem] -translate-x-[80%] -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 opacity-20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-[42rem] w-[42rem] -translate-x-[20%] -translate-y-1/2 rounded-full bg-teal-400 opacity-20 blur-[120px]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="pointer-events-none absolute top-24 right-0 bottom-0 hidden w-1/2 lg:block">
        <Image
          src="/avatar.png"
          alt="Gabe waving hello"
          fill
          priority
          sizes="50vw"
          className="object-contain object-bottom"
        />
      </div>

      <Container className="relative z-10 flex h-full flex-col justify-center">
        <div className="max-w-2xl">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Hello, I&apos;m Gabe
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-foreground sm:text-xl">
            A software engineer shipping{" "}
            <span className="font-medium text-foreground">
              beautiful, useful
            </span>{" "}
            websites and apps for{" "}
            <span className="font-medium text-foreground">7+ years</span> —
            turning ideas into polished products people actually love to use.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button size="lg">Contact</Button>
            <Link
              href="#builds"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              Check my builds
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

export { Hero }
