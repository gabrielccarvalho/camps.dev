import { Frame, FrameDivider } from "@workspace/ui/components/frame"

import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { LogoTicker } from "@/components/sections/logo-ticker"
import { Newsletter } from "@/components/sections/newsletter"
import { Projects } from "@/components/sections/projects"

export default function Page() {
  return (
    <>
      <Navbar />
      {/* Clip (not hidden) horizontal overflow so the framing crosshairs — which
          sit centered on the rails and poke a few px past the right rail when the
          1440 column collapses to the viewport (<1440px) — don't trigger a
          horizontal scrollbar. `clip` avoids creating a scroll container, so the
          Projects sticky hand-off keeps working. */}
      <main className="overflow-x-clip">
        <Frame className="[--frame-width:1440px]">
          <Hero />
          <FrameDivider />
        </Frame>

        {/* Ticker opts out of the frame — full-bleed band, no rails. */}
        <LogoTicker />

        <Frame className="[--frame-width:1440px]">
          <FrameDivider />
          <Projects />
          <FrameDivider />
        </Frame>

        {/* Newsletter opts out of the frame — full-bleed band with an inverse card. */}
        <Newsletter />
      </main>
    </>
  )
}
