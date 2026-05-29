const logos = [
  { name: "Fetchly", src: "/logos/fetchly.svg" },
  { name: "Cantoo", src: "/logos/cantoo.svg" },
  { name: "Boa Vista", src: "/logos/boa-vista-consumidor-positivo.svg" },
  { name: "Acordo Certo", src: "/logos/acordo-certo.svg" },
  { name: "iFeira", src: "/logos/ifeira.svg" },
  { name: "TopFlight", src: "/logos/topflight.svg" },
]

// One sequence repeats the logos enough to overflow wide viewports, then the
// marquee renders it twice so translateX(-50%) loops seamlessly with no gap.
const sequence = [...logos, ...logos, ...logos]

function LogoTicker() {
  return (
    <section className="py-12">
      <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee items-center [--marquee-duration:70s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...sequence, ...sequence].map((logo, index) => (
            <span
              key={index}
              role="img"
              aria-label={index < logos.length ? logo.name : undefined}
              aria-hidden={index >= logos.length}
              style={{
                maskImage: `url(${logo.src})`,
                WebkitMaskImage: `url(${logo.src})`,
              }}
              className="me-24 h-8 w-28 shrink-0 bg-muted-foreground/70 transition-colors duration-300 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] hover:bg-foreground"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export { LogoTicker }
