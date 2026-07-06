import type { Policy, PolicyDomain, PolicyEnforcement } from "../types/policy.types";

export type PolicyBlueprint = Pick<
  Policy,
  "name" | "domain" | "enforcement" | "description" | "appliesToTags"
>;

export const POLICY_BLUEPRINTS: PolicyBlueprint[] = [
  {
    name: "FileVault encryption",
    domain: "security",
    enforcement: "enforced",
    description: "Enforce full-disk encryption with managed key escrow.",
    appliesToTags: ["finance", "hipaa", "sox", "pci"],
  },
  {
    name: "OS 14.2 baseline",
    domain: "os",
    enforcement: "enforced",
    description: "All devices must run macOS 14.2 or later.",
    appliesToTags: [],
  },
  {
    name: "MFA required for admin actions",
    domain: "identity",
    enforcement: "enforced",
    description: "All admin actions require step-up authentication.",
    appliesToTags: [],
  },
  {
    name: "VPN always-on",
    domain: "network",
    enforcement: "enforced",
    description: "Off-corp networks route through managed VPN.",
    appliesToTags: ["remote", "field"],
  },
  {
    name: "USB storage disabled",
    domain: "security",
    enforcement: "enforced",
    description: "Removable storage blocked for sensitive orgs.",
    appliesToTags: ["hipaa", "pci", "finance"],
  },
  {
    name: "Screen lock 5 min",
    domain: "security",
    enforcement: "enforced",
    description: "Auto-lock after 5 minutes of inactivity.",
    appliesToTags: [],
  },
  {
    name: "Firewall on",
    domain: "network",
    enforcement: "enforced",
    description: "System firewall must remain enabled.",
    appliesToTags: [],
  },
  {
    name: "AV definitions fresh",
    domain: "security",
    enforcement: "warn",
    description: "Antivirus definitions must be no older than 48h.",
    appliesToTags: [],
  },
  {
    name: "SSH disabled",
    domain: "security",
    enforcement: "enforced",
    description: "SSH server disabled by default.",
    appliesToTags: [],
  },
  {
    name: "Compliance audit trail",
    domain: "compliance",
    enforcement: "audit",
    description: "Log all admin actions for compliance review.",
    appliesToTags: ["sox", "hipaa"],
  },
  {
    name: "Application allow-list",
    domain: "security",
    enforcement: "warn",
    description: "Warn on installs outside the managed catalog.",
    appliesToTags: [],
  },
  {
    name: "Backup verified daily",
    domain: "compliance",
    enforcement: "warn",
    description: "Nightly backup with integrity check.",
    appliesToTags: ["finance", "engineering"],
  },
];

export const POLICY_DOMAINS_ORDER: PolicyDomain[] = [
  "security",
  "identity",
  "network",
  "os",
  "compliance",
];

export const POLICY_ENFORCEMENT_ORDER: PolicyEnforcement[] = [
  "enforced",
  "warn",
  "audit",
];
