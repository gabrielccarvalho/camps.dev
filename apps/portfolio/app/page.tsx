import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { LogoTicker } from "@/components/sections/logo-ticker"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoTicker />
      </main>
    </>
  )
}
