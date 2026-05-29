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
      <main>
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
