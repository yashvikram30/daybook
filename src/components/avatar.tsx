/* eslint-disable @next/next/no-img-element -- a provider-hosted profile photo; nothing to optimise */
import { Icon } from "./icons";

/** The signed-in user's photo, falling back to their initial, or a person icon for guests. */
export function Avatar({ name, image }: { name?: string | null; image?: string | null }) {
  if (image) return <img className="avatar" src={image} alt="" referrerPolicy="no-referrer" />;
  if (name?.trim()) return <span className="avatar">{name.trim().charAt(0).toUpperCase()}</span>;
  return <span className="avatar guest">{Icon.user}</span>;
}
