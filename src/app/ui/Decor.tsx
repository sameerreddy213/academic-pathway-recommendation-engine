/** Decorative animated background orbs — purely presentational, no interaction. */
export default function Decor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div className="float-a absolute -top-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="float-b absolute top-32 -right-28 h-[30rem] w-[30rem] rounded-full bg-amber-200/40 blur-3xl" />
      <div className="float-a absolute bottom-[-6rem] left-1/4 h-80 w-80 rounded-full bg-teal-200/30 blur-3xl" />
      {/* subtle paper grain via radial tint */}
      <div className="absolute inset-0 bg-[radial-gradient(60rem_60rem_at_70%_-10%,rgba(15,118,110,0.05),transparent)]" />
    </div>
  );
}
