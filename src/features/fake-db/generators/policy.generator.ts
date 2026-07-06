import { POLICY_BLUEPRINTS } from "../constants/policy.constants";
import type { Policy } from "../types/policy.types";
import type { User } from "../types/user.types";
import type { SeededRng } from "../utils/seeded-rng";
import { isoFromOffset } from "../utils/timestamp.utils";

export const generatePolicies = (rng: SeededRng, users: User[]): Policy[] => {
  const admins = users.filter(
    (user) => user.role === "admin" || user.role === "engineer",
  );
  const owners = admins.length > 0 ? admins : users;

  return POLICY_BLUEPRINTS.map((blueprint, index) => {
    const owner = rng.pick(owners);
    // Policies live in the "long-ago" past — created 30-540 days before now.
    const daysAgo = rng.int(30, 540);
    const version = rng.int(1, 6);

    return {
      id: `policy_${index + 1}`,
      name: blueprint.name,
      domain: blueprint.domain,
      enforcement: blueprint.enforcement,
      description: blueprint.description,
      appliesToTags: [...blueprint.appliesToTags],
      version,
      createdAt: isoFromOffset(-daysAgo * 24 * 60),
      ownerUserId: owner.id,
    };
  });
};
