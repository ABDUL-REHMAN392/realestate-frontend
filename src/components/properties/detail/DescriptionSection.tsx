"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

export default function DescriptionSection({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 400;
  const text = isLong && !expanded ? description.slice(0, 400) + "..." : description;
  const bulletLines = description
    .split("\n")
    .filter((l) => l.startsWith("•") || l.startsWith("-"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-[#E2EAD8] rounded-2xl p-5"
    >
      <h2 className="font-bold text-[#1C1C1C] mb-3">Description</h2>
      <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-line">{text}</p>

      {bulletLines.length > 0 && (
        <ul className="mt-3 space-y-1">
          {bulletLines.map((l, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
              <CheckCircle className="h-4 w-4 text-[#3B6D11] flex-shrink-0 mt-0.5" />
              {l.replace(/^[•\-]\s*/, "")}
            </li>
          ))}
        </ul>
      )}

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-xs font-semibold text-[#3B6D11] flex items-center gap-1 hover:underline"
        >
          {expanded
            ? <><ChevronUp className="h-3 w-3" /> Show Less</>
            : <><ChevronDown className="h-3 w-3" /> Read More</>
          }
        </button>
      )}
    </motion.div>
  );
}