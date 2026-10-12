/**
 * The site owner is whoever signs in with an email listed in ANALYTICS_OWNER_EMAIL (comma-separated).
 * Unset means nobody: the analytics page then behaves as if it did not exist.
 */
export function isOwnerEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const owners = (process.env.ANALYTICS_OWNER_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return owners.includes(email.trim().toLowerCase());
}
