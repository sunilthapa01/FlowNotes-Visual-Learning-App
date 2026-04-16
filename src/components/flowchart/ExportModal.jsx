import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import html2canvas from "html2canvas";
import {
  X,
  Image as ImageIcon,
  FileJson,
  Download,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

export default function ExportModal({ open, onClose, canvasRef, nodes }) {
  const [selected, setSelected] = useState(null);

  const exportOptions = [
    {
      id: "png",
      title: "Export as Image (PNG)",
      description: "Download your flowchart as a high-resolution PNG image.",
      icon: ImageIcon,
      color: "#4F8EF7",
    },
    {
      id: "json",
      title: "Export as Data (JSON)",
      description: "Save your flowchart data as a JSON file for later import.",
      icon: FileJson,
      color: "#9B5DE5",
    },
  ];
  console.log(selected);

  console.log("Export Component :- ", nodes);


  const handleExport = async () => {
    if (selected === "json") {
      console.log("Export JSON:", nodes);
      const data = JSON.stringify(nodes, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "flow.json";
      a.click();
    } else if (selected === "png") {
      if (!canvasRef?.current) {
        console.log("Canvas not found ❌");
        return;
      }

      try {
        const canvas = await html2canvas(canvasRef.current);

        const imgData = canvas.toDataURL("image/png");

        const a = document.createElement("a");
        a.href = imgData;
        a.download = "flow.png";
        a.click();
      } catch (err) {
        console.error("PNG export error:", err);
      }
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60]"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(8px)",
            }}
          />
        </Dialog.Overlay>

        <Dialog.Content asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md outline-none"
          >
            <div
              className="rounded-3xl overflow-hidden shadow-2xl"
              style={{
                background: "rgba(10,14,28,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow:
                  "0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(79,142,247,0.1)",
                backdropFilter: "blur(40px)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #4F8EF7, #9B5DE5)",
                    }}
                  >
                    <Download size={18} className="text-white" />
                  </div>
                  <div>
                    <Dialog.Title className="text-base font-bold text-white tracking-tight">
                      Export Options
                    </Dialog.Title>
                    <Dialog.Description className="text-xs text-[var(--text-muted)] font-medium">
                      Choose your preferred export format
                    </Dialog.Description>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer text-[var(--text-muted)] hover:text-white transition-all bg-white/5 hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Options Grid */}
              <div className="px-6 py-6 space-y-4">
                {exportOptions.map((opt) => (
                  <motion.button
                    key={opt.id}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative flex items-center gap-4 p-4 rounded-2xl text-left cursor-pointer group transition-all"
                    style={{
                      background:
                        selected === opt.id
                          ? `${opt.color}20`
                          : "rgba(255,255,255,0.03)",
                      border:
                        selected === opt.id
                          ? `1px solid ${opt.color}`
                          : "1px solid rgba(255,255,255,0.06)",
                    }}
                    onClick={() => {
                      setSelected(opt.id === selected ? null : opt.id);
                    }}
                  >
                    {/* Hover Glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 10% 50%, ${opt.color}15 0%, transparent 70%)`,
                        border: `1px solid ${opt.color}40`,
                      }}
                    />

                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{
                        background: `${opt.color}15`,
                        border: `1px solid ${opt.color}30`,
                      }}
                    >
                      <opt.icon size={22} style={{ color: opt.color }} />
                    </div>

                    <div className="flex-1 relative z-10">
                      <h4 className="text-sm font-bold text-white group-hover:text-[var(--text-primary)] transition-colors">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 opacity-0 group-hover:opacity-100 transition-all relative z-10">
                      <Sparkles size={12} style={{ color: opt.color }} />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div
                className="px-6 py-4 flex justify-end border-t"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(0,0,0,0.2)",
                }}
              >
                <button
                  onClick={() => {
                    handleExport();
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleExport();
                    console.log("Clicked !");
                  }}
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                >
                  Export
                </button>
              </div>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
