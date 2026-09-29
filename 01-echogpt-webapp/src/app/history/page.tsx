import type { Metadata } from "next";
import { HistoryList } from "@/components/history/HistoryList";

export const metadata: Metadata = {
  title: "Chat history",
  description:
    "Search, filter and pin every conversation, grouped by date and filterable by model.",
};

export default function HistoryPage() {
  return <HistoryList />;
}
