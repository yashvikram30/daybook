import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { loadReport, type Report } from "@/lib/analytics-store";
import { isOwnerEmail } from "@/lib/owner";
import "./analytics.css";
import { Header, isRange, RANGES, ReportView, type RangeKey } from "./report-view";

// Blocks on the session on purpose: a visitor who is not the owner then gets a real 404 before
// anything streams, instead of a 200 whose title and loading state reveal the page exists.
export const instant = false;

// Set here, not through `metadata`: that export would put "Analytics" in the title of the 404
// that everyone else gets. React moves these tags into <head>.
const meta = (
  <>
    <title>Analytics · Daybook</title>
    <meta name="robots" content="noindex, nofollow" />
  </>
);

export default async function AnalyticsPage({ searchParams }: PageProps<"/analytics">) {
  const session = await auth();
  if (!isOwnerEmail(session?.user?.email)) notFound();

  const { range: raw } = await searchParams;
  const key: RangeKey = isRange(raw) ? raw : "7d";
  let report: Report;
  try {
    report = await loadReport(RANGES[key].ms);
  } catch (e) {
    console.error("analytics query failed", e);
    return (
      <main className="an" id="main">
        {meta}
        <article>
          <Header current={key} />
          <p className="callout">Could not reach the database, so there is nothing to show yet.</p>
        </article>
      </main>
    );
  }
  return (
    <main className="an" id="main">
      {meta}
      <article>
        <ReportView current={key} report={report} />
      </article>
    </main>
  );
}
