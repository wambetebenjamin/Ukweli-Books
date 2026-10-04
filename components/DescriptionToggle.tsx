"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DescriptionToggle({ paragraphs }: { paragraphs: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={`description-text ${open ? "" : "clamped"}`} style={open ? { maxHeight: "none" } : undefined}>
        {paragraphs.map((p, i) => (
          <p key={i} style={{ fontSize: 15 }}>{p}</p>
        ))}
      </div>
      <button className="read-more-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? "Read less" : "Read more"}
        <ChevronDown style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 250ms" }} />
      </button>
    </div>
  );
}
