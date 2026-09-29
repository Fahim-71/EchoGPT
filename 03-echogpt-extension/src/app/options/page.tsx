import { OptionsShell } from "@/components/options/options-shell";

/**
 * `/options` → `options.html`, registered as the MV3 `options_page`.
 * Opens in a full browser tab, so unlike the other two surfaces it is a normal
 * responsive page rather than a fixed-width column.
 */
export default function OptionsPage() {
  return (
    // The background lives here rather than on the shell: the shell is also
    // embedded inside the showcase's browser mock, where it must not paint a
    // full-viewport background of its own.
    <main className="min-h-screen bg-background-subtle">
      <OptionsShell />
    </main>
  );
}
