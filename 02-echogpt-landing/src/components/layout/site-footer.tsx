import { FOOTER_COLUMNS } from "@/data/nav";
import { SITE } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DiscordMark,
  EchoLogo,
  GitHubMark,
  XMark,
} from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";

const SOCIALS = [
  { label: "EchoGPT on X", href: SITE.webApp, Icon: XMark },
  { label: "EchoGPT on GitHub", href: SITE.webApp, Icon: GitHubMark },
  { label: "EchoGPT on Discord", href: SITE.webApp, Icon: DiscordMark },
];

const LEGAL = [
  { label: "Privacy", href: SITE.webApp },
  { label: "Terms", href: SITE.webApp },
  { label: "Security", href: SITE.webApp },
  { label: "Chrome Web Store listing", href: SITE.chromeStore },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background-subtle">
      <Container size="wide" className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))]">
          <div className="max-w-sm sm:col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 font-semibold tracking-tight">
              <EchoLogo />
              <span className="text-base">
                Echo<span className="text-brand-600 dark:text-brand-300">GPT</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              One sidebar for every AI model. Summarise the page you're on,
              explain what you've highlighted, and compare answers side by side
              — without a third-party analytics script anywhere in sight.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
              <ThemeToggle className="ml-1" />
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.company}. EchoGPT extension
            v{SITE.extension.version} · {SITE.extension.size} ·{" "}
            {SITE.extension.category}.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
