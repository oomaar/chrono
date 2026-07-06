export type PolicyDomain = "security" | "compliance" | "network" | "os" | "identity";

export type PolicyEnforcement = "enforced" | "warn" | "audit";

export type Policy = {
  id: string;
  name: string;
  domain: PolicyDomain;
  enforcement: PolicyEnforcement;
  description: string;
  appliesToTags: string[];
  version: number;
  createdAt: string;
  ownerUserId: string;
};
