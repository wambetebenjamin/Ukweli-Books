import React from "react";

/** Minimal markdown renderer for blog posts: ##, >, -, **bold**, *italic*, paragraphs. */
function renderInline(text: string, keyPrefix: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let rest = text;
  let i = 0;
  while (rest.length) {
    const boldIdx = rest.indexOf("**");
    const italicIdx = rest.indexOf("*");
    if (boldIdx === -1 && italicIdx === -1) { parts.push(rest); break; }
    if (boldIdx !== -1 && (italicIdx === -1 || boldIdx <= italicIdx)) {
      if (boldIdx > 0) parts.push(rest.slice(0, boldIdx));
      const end = rest.indexOf("**", boldIdx + 2);
      if (end === -1) { parts.push(rest); break; }
      parts.push(<strong key={`${keyPrefix}-b${i++}`}>{rest.slice(boldIdx + 2, end)}</strong>);
      rest = rest.slice(end + 2);
    } else {
      if (italicIdx > 0) parts.push(rest.slice(0, italicIdx));
      const end = rest.indexOf("*", italicIdx + 1);
      if (end === -1) { parts.push(rest); break; }
      parts.push(<em key={`${keyPrefix}-i${i++}`}>{rest.slice(italicIdx + 1, end)}</em>);
      rest = rest.slice(end + 1);
    }
  }
  return parts;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (para.length) {
      blocks.push(<p key={key++}>{renderInline(para.join(" "), `p${key}`)}</p>);
      para = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={key++}>
          {list.map((item, j) => <li key={j}>{renderInline(item, `li${key}-${j}`)}</li>)}
        </ul>
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); continue; }
    if (line.startsWith("## ")) { flushPara(); flushList(); blocks.push(<h2 key={key++}>{renderInline(line.slice(3), `h2${key}`)}</h2>); continue; }
    if (line.startsWith("### ")) { flushPara(); flushList(); blocks.push(<h3 key={key++}>{renderInline(line.slice(4), `h3${key}`)}</h3>); continue; }
    if (line.startsWith("> ")) { flushPara(); flushList(); blocks.push(<blockquote key={key++}>{renderInline(line.slice(2), `q${key}`)}</blockquote>); continue; }
    if (line.startsWith("- ")) { flushPara(); list.push(line.slice(2)); continue; }
    para.push(line);
  }
  flushPara(); flushList();
  return <>{blocks}</>;
}
