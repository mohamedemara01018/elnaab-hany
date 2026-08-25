"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface UploadFieldProps {
  label: string;
  optional?: boolean;
  hint: string;
}

export function UploadField({ label, optional, hint }: UploadFieldProps) {
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
      {label}
      {optional && <span className="font-normal text-on-surface-variant text-xs">(اختياري)</span>}

      <motion.div
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="border-2 border-dashed border-outline-variant rounded-lg p-6 flex flex-col items-center gap-1.5 cursor-pointer text-center"
      >
        <div className="text-xl">📎</div>
        <strong>اضغط لاختيار مرفق</strong>
        <span className="text-body-small">{hint}</span>
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
      />

      <AnimatePresence>
        {fileName && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center bg-surface-container rounded-md px-3.5 py-2.5 text-sm overflow-hidden"
          >
            <span>{fileName}</span>
            <button
              type="button"
              className="border-none bg-transparent text-error font-bold cursor-pointer"
              onClick={() => setFileName("")}
            >
              إزالة ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </label>
  );
}
