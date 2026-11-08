const RING_TEXT = "NO SIGN-UP • NO WATERMARK • FREE FOREVER • ";

/**
 * Round "100% FREE" stamp for the empty right side of the hero (wide screens,
 * 1280px+). Coral-orange contrasts with the brand teal; the ring text turns slowly
 * unless the user prefers reduced motion.
 */
export function FreeSeal() {
  return (
    <div
      role="img"
      aria-label="100% free. No sign-up, no watermark, free forever."
      className="pointer-events-none absolute top-1/2 right-[max(2rem,calc(50%-600px))] hidden -translate-y-1/2 rotate-[-8deg] xl:block"
    >
      <div className="relative size-44 rounded-full bg-orange-500 shadow-xl shadow-orange-600/30 ring-8 ring-orange-100 2xl:size-48">
        <svg viewBox="0 0 200 200" className="absolute inset-0 size-full motion-safe:animate-[spin_24s_linear_infinite]" aria-hidden="true">
          <defs>
            <path id="free-seal-ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <text fill="#fff7ed" fontSize="13" fontWeight="700" letterSpacing="2.6">
            <textPath href="#free-seal-ring">{RING_TEXT}</textPath>
          </text>
        </svg>
        <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white text-orange-600 shadow-inner">
          <span className="text-[28px] leading-none font-black tracking-tight 2xl:text-[32px]">100%</span>
          <span className="mt-0.5 text-base font-extrabold tracking-[0.2em] text-slate-900">FREE</span>
        </div>
      </div>
    </div>
  );
}
