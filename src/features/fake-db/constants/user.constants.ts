import type { UserRole } from "../types/user.types";

export const USER_FIRST_NAMES = [
  "Avery",
  "Jordan",
  "Noah",
  "Mina",
  "Reese",
  "Kai",
  "Taylor",
  "Cameron",
  "Harper",
  "Quinn",
  "Logan",
  "Riley",
  "Sofia",
  "Rafael",
  "Ines",
  "Malik",
  "Priya",
  "Yuki",
  "Aiden",
  "Nora",
  "Elena",
  "Omar",
  "Sana",
  "Theo",
] as const;

export const USER_LAST_NAMES = [
  "Patel",
  "Miller",
  "Nguyen",
  "Ali",
  "Khan",
  "Diaz",
  "Chen",
  "Singh",
  "Silva",
  "Wong",
  "Keller",
  "Osei",
  "Alvarez",
  "Braun",
  "Shah",
  "Costa",
  "Nakamura",
  "Fischer",
  "Sørensen",
  "Bennett",
] as const;

/**
 * Weighted role distribution — realistic enterprise mix.
 */
export const USER_ROLE_WEIGHTS: Array<{ role: UserRole; weight: number }> = [
  { role: "operator", weight: 12 },
  { role: "engineer", weight: 10 },
  { role: "admin", weight: 3 },
  { role: "auditor", weight: 2 },
  { role: "viewer", weight: 5 },
];

export const TEAM_BLUEPRINTS = [
  { slug: "endpoint", name: "Endpoint Reliability", office: "berlin" },
  { slug: "platform", name: "Client Platform", office: "nyc" },
  { slug: "field", name: "Field Operations", office: "london" },
  { slug: "security", name: "Security Response", office: "berlin" },
  { slug: "compliance", name: "Compliance & Audit", office: "singapore" },
] as const;
