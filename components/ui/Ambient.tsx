/**
 * The page's living backdrop: three soft fields of colour drifting very slowly behind
 * everything, and a fine film grain over the top. Felt more than seen.
 */
export function Ambient() {
  return (
    <>
      <div aria-hidden className="ambient">
        <span className="ambient-field ambient-a" />
        <span className="ambient-field ambient-b" />
        <span className="ambient-field ambient-c" />
      </div>
      <div aria-hidden className="grain" />
    </>
  );
}
