"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AccountPanel } from "./account-panel";
import { exportBackup, importBackup, resetEverything } from "@/lib/backup";
import { useBrain } from "@/lib/brain-store";
import { useGuestState } from "@/lib/guest-store";
import { savePlan, usePlan, useHydrated } from "@/lib/plan-store";
import { formatDate } from "@/lib/schedule";
import { toast } from "@/lib/toast";

function setTheme(t: "light" | "dark" | "system") {
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

export function SettingsPanel() {
  const hydrated = useHydrated();
  const plan = usePlan();
  const guest = useGuestState();
  const brain = useBrain();
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
    <div className="settings">
      <section>
        <h2 id="account">Account</h2>
        <AccountPanel />
      </section>

      <section>
        <h2 id="plan">Plan</h2>
        {plan ? (
          <p>
            Starts <b>{formatDate(plan.startDate, { year: true })}</b>, studying{" "}
            <b>
              {plan.studyDays.map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d]).join(", ")}
            </b>
            .
          </p>
        ) : (
          <p>You have not picked a start date yet.</p>
        )}
        <div className="row-actions">
          <Link className="btn" href="/start">
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
      </section>

      <section>
        <h2 id="appearance">Appearance</h2>
        <div className="row-actions">
          <button className="btn" type="button" onClick={() => setTheme("light")}>
            Light
          </button>
          <button className="btn" type="button" onClick={() => setTheme("dark")}>
            Dark
          </button>
          <button className="btn" type="button" onClick={() => setTheme("system")}>
            Match my device
          </button>
        </div>
      </section>

      <section>
        <h2 id="data">Your data</h2>
        <p>
          Progress and notes: {done} {done === 1 ? "day" : "days"} complete, {checked}{" "}
          {checked === 1 ? "item" : "items"} checked, {brain.notes.length}{" "}
          {brain.notes.length === 1 ? "note" : "notes"} in your second brain. Signed-in accounts save this
          automatically; guests should download a backup before clearing site data or switching browsers.
        </p>
        <div className="row-actions">
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
      </section>

      <section>
        <h2 id="reset">Reset</h2>
        <p>
          Clears all progress, journals, second-brain notes, review cards and your streak on this device. The
          plan dates stay.
        </p>
        {confirmReset ? (
          <div className="row-actions">
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
          <button className="btn danger" type="button" onClick={() => setConfirmReset(true)}>
            Reset all progress
          </button>
        )}
      </section>
    </div>
  );
}
