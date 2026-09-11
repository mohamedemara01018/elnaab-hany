"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface UploadFieldProps {
  label: string;
  optional?: boolean;
  hint: string;
  onChange?: (file: File | null) => void;
}

export function UploadField({ label, optional, hint, onChange }: UploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (onChange) onChange(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (onChange) onChange(null);
  };

  return (
    <label className="flex flex-col gap-2 font-display text-sm font-bold text-on-surface">
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {optional && <span className="font-normal text-on-surface-variant text-xs">(اختياري)</span>}
      </div>

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
        <span className="text-body-small font-normal">{hint}</span>
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleFileChange}
      />

      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex justify-between items-center bg-surface-container rounded-md px-3.5 py-2.5 text-sm overflow-hidden"
          >
            <span className="truncate max-w-[80%] font-normal">{selectedFile.name}</span>
            <button
              type="button"
              className="border-none bg-transparent text-error font-bold cursor-pointer hover:opacity-80 shrink-0"
              onClick={handleRemove}
            >
              إزالة ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </label>
  );
}