import type { Metadata } from "next";
import { SettingsPanel } from "@/components/settings-panel";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <article>
      <h1>Settings</h1>
      <p className="lead">Your plan, theme and a backup of your progress.</p>
      <SettingsPanel />
    </article>
  );
}
