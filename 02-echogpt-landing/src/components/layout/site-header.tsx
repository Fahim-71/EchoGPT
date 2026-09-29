"use client";

import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS, SPY_IDS } from "@/data/nav";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChromeMark, EchoLogo } from "@/components/ui/brand-icons";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MobileMenu } from "./mobile-menu";

const TRIGGER_ID = "mobile-menu-trigger";

/**
 * Sticky header. Transparent over the hero, then picks up the glass treatment
 * and a hairline border once the page has scrolled — the height never changes,
 * so nothing below it shifts.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(SPY_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "surface-glass border-b border-border shadow-soft"
          : "border-b border-transparent",
      )}
    >
      <Container size="wide" className="relative flex h-16 items-center gap-3">
        <a
          href="#top"
          className="flex items-center gap-2 rounded-lg font-semibold tracking-tight"
        >
          <EchoLogo />
          <span className="text-base">
            Echo<span className="text-brand-600 dark:text-brand-300">GPT</span>
          </span>
        </a>

        <nav aria-label="Primary" className="ml-4 hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = activeId === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-brand-700 dark:text-brand-300"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-500"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink
            href={SITE.webApp}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Open web app
          </ButtonLink>
          <ButtonLink
            href={SITE.chromeStore}
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <ChromeMark className="size-4" />
            Add to Chrome
          </ButtonLink>
          <button
            id={TRIGGER_ID}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu-panel"
            aria-label="Open menu"
            className="grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-foreground md:hidden"
          >
            <Menu className="size-4" />
          </button>
        </div>

        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          activeId={activeId}
          triggerId={TRIGGER_ID}
        />
      </Container>
    </header>
  );
}
