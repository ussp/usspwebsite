import { auth } from "./auth";
import { getCandidateByLinkedInOrEmail } from "@ussp-platform/core/queries/portal";
import type { AdminCandidate } from "@ussp-platform/core/types/admin";

interface PortalUser {
  session: { user: Record<string, unknown> };
  candidate: AdminCandidate;
}

/**
 * Resolve the current LinkedIn session to a candidate record.
 * Returns null if not authenticated or no candidate found.
 */
export async function getPortalCandidate(): Promise<PortalUser | null> {
  const session = await auth();
  if (!session?.user) return null;

  const user = session.user as Record<string, unknown>;
  const linkedinSub = user.linkedinSub as string | undefined;
  const email = user.email as string | undefined;

  if (!linkedinSub && !email) return null;

  const candidate = await getCandidateByLinkedInOrEmail(linkedinSub, email);
  if (!candidate) return null;

  return { session: { user }, candidate };
}
