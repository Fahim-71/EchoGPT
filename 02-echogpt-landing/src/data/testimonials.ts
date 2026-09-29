export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  /** Two-letter monogram; the avatar is initials on a brand gradient. */
  initials: string;
  /** Index into the avatar gradient palette. */
  accent: 0 | 1 | 2 | 3 | 4 | 5;
}

/** Illustrative for this assessment build — see the README. */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I was paying for three chatbots and still tab-hopping between them. Now the sidebar is open next to whatever I'm reading and I pick the model in the composer.",
    name: "Nadia Rahman",
    role: "Product designer",
    initials: "NR",
    accent: 0,
  },
  {
    id: "t2",
    quote:
      "Compare is the feature I didn't know I wanted. Same prompt, two columns, and it's immediately obvious which model actually understood the question.",
    name: "Tomas Lindqvist",
    role: "Staff engineer",
    initials: "TL",
    accent: 1,
  },
  {
    id: "t3",
    quote:
      "Our security review usually kills these tools. No third-party analytics and a configurable endpoint meant it went through in one meeting.",
    name: "Priya Chandrasekaran",
    role: "IT operations lead",
    initials: "PC",
    accent: 2,
  },
  {
    id: "t4",
    quote:
      "Highlight a clause, hit explain, keep reading. I get through contract review in about half the time I used to.",
    name: "Daniel Osei",
    role: "Contracts manager",
    initials: "DO",
    accent: 3,
  },
  {
    id: "t5",
    quote:
      "Summarising a forty-page vendor doc used to mean copying it into another tab in chunks. Now it's one keyboard shortcut on the page itself.",
    name: "Mei-Ling Chen",
    role: "Research analyst",
    initials: "MC",
    accent: 4,
  },
  {
    id: "t6",
    quote:
      "The Image Studio living in the same workspace as the chat is the bit that stuck. Draft the copy, make the visual, never leave the tab.",
    name: "Arjun Mehta",
    role: "Growth marketer",
    initials: "AM",
    accent: 5,
  },
];
