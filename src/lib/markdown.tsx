import Link from "next/link";
import type { ReactNode } from "react";

export type LinkTarget = { href: string; kind: "note" | "day" | "missing" };

type Props = {
  text: string;
  /** Where a [[wiki link]] goes. */
  resolve: (target: string) => LinkTarget;
  /** Called with the source line of a task item when its box is clicked. Omit for a read-only view. */
  onToggle?: (line: number) => void;
};

const INLINE =
  /`([^`\n]+)`|\*\*([^*\n]+)\*\*|\*([^*\s][^*\n]*)\*|\[\[([^\]\n]+)\]\]|\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(^|[\s(])#([a-z][\w/-]*)/gi;

/** Inline formatting. Everything becomes React elements, so nothing in a note can inject markup. */
function inline(src: string, resolve: Props["resolve"]): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of src.matchAll(INLINE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(src.slice(last, at));
    last = at + m[0].length;
    if (m[1] !== undefined) out.push(<code key={k++}>{m[1]}</code>);
    else if (m[2] !== undefined) out.push(<strong key={k++}>{inline(m[2], resolve)}</strong>);
    else if (m[3] !== undefined) out.push(<em key={k++}>{inline(m[3], resolve)}</em>);
    else if (m[4] !== undefined) {
      const t = resolve(m[4].trim());
      out.push(
        <Link key={k++} href={t.href} className={"wiki " + t.kind}>
          {m[4].trim()}
        </Link>,
      );
    } else if (m[5] !== undefined)
      out.push(
        <a key={k++} href={m[6]} target="_blank" rel="noopener noreferrer">
          {m[5]}
        </a>,
      );
    else if (m[8] !== undefined) {
      out.push(m[7]);
      out.push(
        <Link key={k++} href={`/notes?tag=${encodeURIComponent(m[8].toLowerCase())}`} className="tag">
          #{m[8]}
        </Link>,
      );
    }
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

const TASK = /^\[( |x|X)\]\s+(.*)$/;
const ROW = /^\s*\|.*\|\s*$/;
const RULE = /^\s*\|(\s*:?-{2,}:?\s*\|)+\s*$/;
const cells = (l: string) =>
  l
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, "|"));

export function Markdown({ text, resolve, onToggle }: Props) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = /^```(\w*)\s*$/.exec(line);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) body.push(lines[i++]);
      i++;
      blocks.push(
        <pre key={key++}>
          <code>{body.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    if (ROW.test(line) && i + 1 < lines.length && RULE.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && ROW.test(lines[i])) rows.push(cells(lines[i++]));
      blocks.push(
        <div key={key++} className="md-table">
          <table>
            <thead>
              <tr>
                {head.map((c, j) => (
                  <th key={j}>{inline(c, resolve)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, j) => (
                <tr key={j}>
                  {head.map((_, k) => (
                    <td key={k}>{inline(r[k] ?? "", resolve)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      const Tag = (["h2", "h3", "h4"] as const)[h[1].length - 1];
      blocks.push(<Tag key={key++}>{inline(h[2], resolve)}</Tag>);
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push(<hr key={key++} />);
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(<blockquote key={key++}>{inline(body.join(" "), resolve)}</blockquote>);
      continue;
    }
    const li = /^(\s*)([-*]|\d+\.)\s+(.*)$/;
    if (li.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items: ReactNode[] = [];
      while (i < lines.length && li.test(lines[i])) {
        const at = i;
        const m = li.exec(lines[i])!;
        const task = TASK.exec(m[3]);
        if (task) {
          const done = task[1] !== " ";
          items.push(
            <li key={at} className={"task" + (done ? " done" : "")}>
              <input
                type="checkbox"
                checked={done}
                aria-label={task[2]}
                {...(onToggle ? { onChange: () => onToggle(at) } : { readOnly: true, disabled: true })}
              />
              <span>{inline(task[2], resolve)}</span>
            </li>,
          );
        } else items.push(<li key={at}>{inline(m[3], resolve)}</li>);
        i++;
      }
      blocks.push(ordered ? <ol key={key++}>{items}</ol> : <ul key={key++}>{items}</ul>);
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(```|#{1,3}\s|>|\s*\||(\s*)([-*]|\d+\.)\s|-{3,}\s*$)/.test(lines[i])
    )
      para.push(lines[i++]);
    blocks.push(<p key={key++}>{inline(para.join(" "), resolve)}</p>);
  }
  return <div className="md">{blocks}</div>;
}

/** Flip the task box on one source line. Returns the new text. */
export function toggleTask(text: string, line: number): string {
  const lines = text.split("\n");
  lines[line] = lines[line].replace(/\[( |x|X)\]/, (_, c: string) => (c === " " ? "[x]" : "[ ]"));
  return lines.join("\n");
}
