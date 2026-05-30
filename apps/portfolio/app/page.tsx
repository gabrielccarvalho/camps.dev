import { Frame, FrameDivider } from "@workspace/ui/components/frame"

import { Navbar } from "@/components/navbar"
import { ScrollToHash } from "@/components/scroll-to-hash"
import { Blog } from "@/components/sections/blog"
import { Footer } from "@/components/sections/footer"
import { Hero } from "@/components/sections/hero"
import { LogoTicker } from "@/components/sections/logo-ticker"
import { Newsletter } from "@/components/sections/newsletter"
import { Projects } from "@/components/sections/projects"

export default function Page() {
  return (
    <>
      <Navbar />
      <ScrollToHash />
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

        <Frame className="[--frame-width:1440px]">
          <FrameDivider />
          <Blog />
          <FrameDivider />
        </Frame>

        {/* Footer holds its own contact band (with the hero's glow) and the
            footer proper, divided internally. The Blog frame's closing divider
            above doubles as this frame's top boundary. */}
        <Frame className="[--frame-width:1440px]">
          <Footer />
        </Frame>
      </main>
    </>
  )
}
