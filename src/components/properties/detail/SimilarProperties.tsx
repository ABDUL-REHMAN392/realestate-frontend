"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SimilarProperty } from "@/lib/types";
import SimilarPropertyCard from "./SimilarPropertyCard";

interface Props {
  similar: SimilarProperty[];
  type: string;
  city: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function SimilarProperties({ similar, type, city }: Props) {
  if (!similar.length) return null;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-[#1C1C1C]">Similar Properties</h2>
        <Link
          href={`/properties?type=${type}&city=${city}`}
          className="text-sm text-[#3B6D11] font-medium hover:underline flex items-center gap-1"
        >
          View All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {similar.map((p) => (
          <SimilarPropertyCard key={p._id} prop={p} />
        ))}
      </motion.div>
    </div>
  );
}