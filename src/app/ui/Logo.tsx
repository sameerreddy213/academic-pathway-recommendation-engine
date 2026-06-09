/**
 * Acdyon brand mark — a recreation of the nested rounded-chevron "A",
 * rendered as scalable SVG on the brand's navy tile.
 *
 * To swap in the official asset: drop it in /public and replace the <svg>
 * with <Image src="/acdyon-mark.svg" .../>.
 */
export function AcdyonLogo({ size = 38 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-xl shadow-md shadow-sky-900/20"
      style={{ width: size, height: size, background: "#0b1a2f" }}
      aria-hidden
    >
      <svg
        width={size * 0.64}
        height={size * 0.64}
        viewBox="0 0 100 100"
        fill="none"
        role="img"
        aria-label="Acdyon"
      >
        <defs>
          <linearGradient
            id="acdyon-grad"
            x1="18"
            y1="22"
            x2="82"
            y2="86"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5BBEF2" />
            <stop offset="1" stopColor="#1789CE" />
          </linearGradient>
        </defs>
        {/* outer peak */}
        <path
          d="M22 80 L50 26 L78 80"
          stroke="url(#acdyon-grad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* inner nested peak */}
        <path
          d="M40 79 L57 41 L70 62"
          stroke="url(#acdyon-grad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
