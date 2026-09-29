import type { Metadata } from "next";
import { CompareBoard } from "@/components/compare/CompareBoard";

export const metadata: Metadata = {
  title: "Compare models",
  description:
    "Send one prompt to up to three models at once and watch each answer stream independently.",
};

export default function ComparePage() {
  return <CompareBoard />;
}
