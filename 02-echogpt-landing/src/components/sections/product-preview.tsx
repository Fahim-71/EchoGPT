import { Columns2, MessageSquare, PanelRight, Wand2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { GradientBlur } from "@/components/ui/gradient-blur";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs, type TabItem } from "@/components/ui/tabs";
import { CompareMock, SidebarMock, StudioMock, WebAppMock } from "./preview-mocks";

const iconClass = "size-4";

const TABS: TabItem[] = [
  {
    id: "web",
    label: "Web app",
    icon: <MessageSquare className={iconClass} />,
    panel: (
      <BrowserFrame url="echogpt.live/chat">
        <WebAppMock />
      </BrowserFrame>
    ),
  },
  {
    id: "sidebar",
    label: "Chrome sidebar",
    icon: <PanelRight className={iconClass} />,
    panel: (
      <BrowserFrame
        url="en.wikipedia.org/wiki/Transformer_(deep_learning)"
        action={
          <span className="inline-flex items-center gap-1.5 rounded-md border border-brand-400/60 bg-brand-500/10 px-2 py-1 text-[10px] font-medium text-brand-600 dark:text-brand-300">
            EchoGPT
          </span>
        }
      >
        <SidebarMock />
      </BrowserFrame>
    ),
  },
  {
    id: "compare",
    label: "Compare",
    icon: <Columns2 className={iconClass} />,
    panel: (
      <BrowserFrame url="echogpt.live/compare">
        <CompareMock />
      </BrowserFrame>
    ),
  },
  {
    id: "studio",
    label: "Studio",
    icon: <Wand2 className={iconClass} />,
    panel: (
      <BrowserFrame url="echogpt.live/image-studio">
        <StudioMock />
      </BrowserFrame>
    ),
  },
];

export function ProductPreview() {
  return (
    <section
      id="preview"
      aria-labelledby="preview-title"
      className="relative scroll-mt-20 overflow-hidden py-20 sm:py-24"
    >
      <GradientBlur className="left-1/2 top-24 size-[34rem] -translate-x-1/2" tone="bg-brand-500/10" />

      <Container size="wide" className="relative">
        <SectionHeading
          id="preview-title"
          eyebrow="Product tour"
          title="Four surfaces, one workspace"
          description="Everything below is live DOM, not a screenshot — resize the window and it reflows, switch the theme and it follows."
        />

        <Reveal delay={1} className="mt-10">
          <Tabs
            aria-label="EchoGPT product surfaces"
            items={TABS}
            panelClassName="mt-8"
          />
        </Reveal>
      </Container>
    </section>
  );
}
