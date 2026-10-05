import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { getCurriculum } from "@/lib/curriculum";
import { buildNav, buildSearch } from "@/lib/nav-model";
import "./globals.css";
import "./theme.css";
import "./motion.css";
import "./revise.css";
import "./focus.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["SOFT", "opsz"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Daybook: learn how computers really work", template: "%s · Daybook" },
  description:
    "Daybook is a 16-week study plan: architecture, operating systems, networking, databases, distributed systems, software engineering, machine learning, generative AI and RAG. Start on any day.",
};

// Runs before paint so the saved theme never flashes.
const themeScript = `try{var t=localStorage.getItem("csplan.theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const curriculum = await getCurriculum();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppShell phases={buildNav(curriculum)} search={buildSearch(curriculum)}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
