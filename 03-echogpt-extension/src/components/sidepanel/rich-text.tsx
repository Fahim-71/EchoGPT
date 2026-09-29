import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A deliberately tiny Markdown subset renderer.
 *
 * Model replies stream in as text with `**bold**`, `*italic*`, `` `code` ``,
 * bullets and checklists. Pulling in a Markdown library for that would be the
 * single largest thing in a 400px extension bundle, and it would also need
 * sanitising. Six inline rules and four block rules cover everything the mock
 * replies produce, and unmatched syntax degrades to plain text.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          className="rounded-xs border border-border bg-surface-2 px-1 py-px font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={key} className="italic text-muted-foreground">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

export interface RichTextProps {
  content: string;
  /** Appends a blinking caret — used while a reply is still streaming. */
  caret?: boolean;
  className?: string;
}

export function RichText({ content, caret, className }: RichTextProps) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className={cn("space-y-2 text-[13px] leading-relaxed", className)}>
      {blocks.map((block, blockIndex) => {
        const lines = block.split("\n");
        const isLast = blockIndex === blocks.length - 1;

        // Checklist
        if (lines.every((l) => /^- \[[ x]\]/.test(l.trim()))) {
          return (
            <ul key={blockIndex} className="space-y-1">
              {lines.map((line, i) => {
                const done = /^- \[x\]/i.test(line.trim());
                return (
                  <li key={i} className="flex items-start gap-1.5">
                    <span
                      aria-hidden
                      className={cn(
                        "mt-[3px] size-3 shrink-0 rounded-xs border",
                        done ? "border-success bg-success/20" : "border-border-strong",
                      )}
                    />
                    <span>{renderInline(line.trim().slice(6), `c${blockIndex}-${i}`)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Bullets
        if (lines.every((l) => /^[-•] /.test(l.trim()))) {
          return (
            <ul key={blockIndex} className="space-y-1">
              {lines.map((line, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span
                    aria-hidden
                    className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-500"
                  />
                  <span>{renderInline(line.trim().slice(2), `b${blockIndex}-${i}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        // Ordered list
        if (lines.every((l) => /^\d+\. /.test(l.trim()))) {
          return (
            <ol key={blockIndex} className="space-y-1">
              {lines.map((line, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-px shrink-0 text-[11px] font-semibold text-brand-500">
                    {line.trim().match(/^\d+/)?.[0]}.
                  </span>
                  <span>
                    {renderInline(line.trim().replace(/^\d+\.\s*/, ""), `o${blockIndex}-${i}`)}
                  </span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={blockIndex}>
            {renderInline(block, `p${blockIndex}`)}
            {caret && isLast && (
              <span
                aria-hidden
                className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-px animate-caret bg-brand-500 align-middle"
              />
            )}
          </p>
        );
      })}
    </div>
  );
}
