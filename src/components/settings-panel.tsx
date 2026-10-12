"use client";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { exportBackup, importBackup, resetEverything } from "@/lib/backup";
import { useBrain } from "@/lib/brain-store";
import { useGuestState } from "@/lib/guest-store";
import { savePlan, usePlan, useHydrated } from "@/lib/plan-store";
import { formatDate } from "@/lib/schedule";
import { toast } from "@/lib/toast";

type Theme = "light" | "dark" | "system";
const THEMES: { value: Theme; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Match my device" },
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function setTheme(t: Theme) {
  const root = document.documentElement;
  try {
    if (t === "system") {
      localStorage.removeItem("csplan.theme");
      root.removeAttribute("data-theme");
    } else {
      localStorage.setItem("csplan.theme", t);
      root.setAttribute("data-theme", t);
    }
  } catch {}
}

/** The saved theme choice, kept in step with the header's toggle by watching the <html> attribute. */
function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      const mo = new MutationObserver(cb);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => mo.disconnect();
    },
    () => {
      const t = document.documentElement.getAttribute("data-theme");
      return t === "light" || t === "dark" ? t : "system";
    },
    () => "system" as const,
  );
}

function Section({
  id,
  title,
  desc,
  tone,
  children,
}: {
  id: string;
  title: string;
  desc: string;
  tone?: "danger";
  children: React.ReactNode;
}) {
  return (
    <section className={"st-card" + (tone ? ` ${tone}` : "")} aria-labelledby={`${id}-h`}>
      <div className="st-head">
        <div>
          <h2 id={id}>
            <span id={`${id}-h`}>{title}</span>
          </h2>
          <p>{desc}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function SettingsPanel() {
  const hydrated = useHydrated();
  const plan = usePlan();
  const guest = useGuestState();
  const brain = useBrain();
  const theme = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  if (!hydrated) return null;

  const checked = Object.keys(guest.items).length;
  const done = Object.keys(guest.done).length;

  function download() {
    const blob = new Blob([exportBackup()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `systems-plan-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Backup downloaded");
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      importBackup(await file.text());
      setError("");
      toast("Progress restored from backup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that file.");
    }
  }

  return (
    <div className="settings st">
      <Section id="plan" title="Plan" desc="When you start and which days of the week you study.">
        {plan ? (
          <dl className="pf-facts">
            <div>
              <dt>Starts</dt>
              <dd>{formatDate(plan.startDate, { year: true })}</dd>
            </div>
            <div>
              <dt>Study days</dt>
              <dd>{plan.studyDays.map((d) => DAYS[d]).join(", ")}</dd>
            </div>
          </dl>
        ) : (
          <p className="st-empty">You have not picked a start date yet.</p>
        )}
        <div className="st-foot">
          <Link className={"btn" + (plan ? "" : " primary")} href="/start">
            {plan ? "Change start date and study days" : "Pick your start date"}
          </Link>
          {plan && (
            <button
              className="btn"
              type="button"
              onClick={() => {
                savePlan(null);
                toast("Plan removed. Progress is kept.");
              }}
            >
              Remove plan
            </button>
          )}
        </div>
      </Section>

      <Section id="appearance" title="Appearance" desc="Light, dark, or whatever your device is set to.">
        <div className="seg" role="radiogroup" aria-label="Theme">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              role="radio"
              aria-checked={theme === t.value}
              className={theme === t.value ? "on" : undefined}
              onClick={() => setTheme(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      <Section
        id="data"
        title="Your data"
        desc="Signed-in accounts save automatically. Guests should keep a backup before clearing site data or switching browsers."
      >
        <ul className="st-counts">
          <li>
            <b>{done}</b> {done === 1 ? "day" : "days"} complete
          </li>
          <li>
            <b>{checked}</b> {checked === 1 ? "item" : "items"} checked
          </li>
          <li>
            <b>{brain.notes.length}</b> {brain.notes.length === 1 ? "note" : "notes"}
          </li>
        </ul>
        <div className="st-foot">
          <button className="btn" type="button" onClick={download}>
            Download backup
          </button>
          <button className="btn" type="button" onClick={() => fileRef.current?.click()}>
            Restore from backup
          </button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onFile} />
        </div>
        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}
      </Section>

      <Section
        id="reset"
        title="Reset"
        tone="danger"
        desc="Clears all progress, journals, second-brain notes, review cards and your streak on this device. The plan dates stay."
      >
        {confirmReset ? (
          <div className="st-foot">
            <button
              className="btn danger"
              type="button"
              onClick={() => {
                resetEverything();
                setConfirmReset(false);
                toast("All progress cleared");
              }}
            >
              Yes, clear everything
            </button>
            <button className="btn" type="button" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <div className="st-foot">
            <button className="btn danger" type="button" onClick={() => setConfirmReset(true)}>
              Reset all progress
            </button>
          </div>
        )}
      </Section>

      <p className="pf-more">
        <Link href="/profile">Your account and progress are on your Profile →</Link>
      </p>
    </div>
  );
}
