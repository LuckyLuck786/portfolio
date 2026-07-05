/* Film-grain + vignette finish: an almost-invisible noise texture over the
   whole site that makes flat color fields read as printed matter. Static
   (not animated) so it costs nothing at runtime. */

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`;
const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

export default function Grain() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[95] opacity-[0.045] mix-blend-multiply"
        style={{ backgroundImage: NOISE_URL }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[94] bg-[radial-gradient(ellipse_115%_100%_at_50%_40%,transparent_62%,rgba(16,16,19,0.06)_100%)]"
      />
    </>
  );
}
