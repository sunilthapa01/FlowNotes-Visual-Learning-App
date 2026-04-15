import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  Save,
  Tag,
  X,
  Plus,
  Sparkles,
  Clock,
  Hash,
  AlignLeft,
  Type,
  CheckCircle2,
} from "lucide-react";

const PRESET_TAGS = [
  "design",
  "dev",
  "api",
  "ux",
  "research",
  "strategy",
  "product",
  "ui",
];
const TAG_COLORS = {
  design: "#4F8EF7",
  dev: "#00F5A0",
  api: "#9B5DE5",
  ux: "#FF6B6B",
  research: "#FFB347",
  strategy: "#9B5DE5",
  product: "#4F8EF7",
  ui: "#00D4FF",
};

export default function NoteEditor({ activeNote, onSave }) {
  const panelRef = useRef(null);
  const [title, setTitle] = useState(activeNote?.title || "");
  const [description, setDescription] = useState(
    activeNote
      ? `This note captures the visual flow for "${activeNote.title}". Add your detailed notes, thoughts, and observations here. You can structure your thinking with markdown-like formatting.`
      : "",
  );
  const [tags, setTags] = useState(activeNote?.tags || []);
  // console.log("This is Title Check :- ", title);
  // console.log("This is Description Check :- ", description);
  // console.log("This is Tags Check :- ", tags);

  const [tagInput, setTagInput] = useState("");
  const [saved, setSaved] = useState(false);
  // console.log("This is Saved Check :- ", saved);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    setTitle(activeNote?.title || "");
    setDescription(activeNote?.description || "");
    setTags(activeNote?.tags || []);
    setSaved(false);

    gsap.fromTo(
      panelRef.current,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.1 },
    );
  }, [activeNote?.id]);

  const addTag = (tag) => {
    const clean = tag.trim().toLowerCase();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  console.log("This is Show S", showTagSuggestions);

  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleSave = () => {
    setSaved(true);
    onSave({
      ...activeNote,
      title,
      tags,
      description,
    });
    gsap.fromTo(
      ".save-btn",
      { scale: 0.95 },
      { scale: 1, duration: 0.3, ease: "back.out(2)" },
    );
    setTimeout(() => setSaved(false), 2500);
  };

  const filteredSuggestions = PRESET_TAGS.filter(
    (t) => t.includes(tagInput.toLowerCase()) && !tags.includes(t),
  );

  return (
    <motion.div
      ref={panelRef}
      className="w-full lg:w-80 xl:w-96 flex flex-col glass border-l border-[var(--border-subtle)] overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Note Editor
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {activeNote
              ? `Editing · ${activeNote.nodes?.length ?? 0} nodes`
              : "Select a note"}
          </p>
        </div>
        <motion.div
          animate={saved ? { scale: [1, 1.2, 1] } : {}}
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: saved
              ? "rgba(0,245,160,0.15)"
              : "rgba(255,255,255,0.05)",
            border: saved
              ? "1px solid rgba(0,245,160,0.3)"
              : "1px solid transparent",
          }}
        >
          {saved ? (
            <CheckCircle2 size={14} className="text-green-400" />
          ) : (
            <Sparkles size={14} className="text-[var(--text-muted)]" />
          )}
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {!activeNote ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full gap-3 text-center"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(79,142,247,0.1)",
                border: "1px solid rgba(79,142,247,0.2)",
              }}
            >
              <AlignLeft size={20} className="text-[var(--accent-blue)]" />
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              Select a note from the sidebar to edit
            </p>
          </motion.div>
        ) : (
          <>
            {/* Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                <Type size={11} />
                Title
              </label>
              <motion.div whileFocusWithin={{ scale: 1.01 }}>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none transition-all duration-200 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(79,142,247,0.5)";
                    e.target.style.boxShadow = "0 0 12px rgba(79,142,247,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </motion.div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                <AlignLeft size={11} />
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes, observations, ideas..."
                rows={7}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none transition-all duration-200 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] leading-relaxed"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid rgba(79,142,247,0.5)";
                  e.target.style.boxShadow = "0 0 12px rgba(79,142,247,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                <Hash size={11} />
                Tags
              </label>

              {/* Tag chips */}
              <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                <AnimatePresence>
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: `${TAG_COLORS[tag] || "#4F8EF7"}18`,
                        border: `1px solid ${TAG_COLORS[tag] || "#4F8EF7"}35`,
                        color: TAG_COLORS[tag] || "#4F8EF7",
                      }}
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:opacity-70 transition-opacity cursor-pointer"
                      >
                        <X size={10} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>

              {/* Tag input */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={12}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    />
                    <input
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowTagSuggestions(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addTag(tagInput);
                        if (e.key === "Escape") setShowTagSuggestions(false);
                      }}
                      onFocus={() => setShowTagSuggestions(true)}
                      onBlur={() =>
                        setTimeout(() => setShowTagSuggestions(false), 150)
                      }
                      placeholder="Add tag..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none transition-all text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addTag(tagInput)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
                    style={{
                      background: "rgba(79,142,247,0.15)",
                      border: "1px solid rgba(79,142,247,0.25)",
                    }}
                  >
                    <Plus size={13} className="text-[var(--accent-blue)]" />
                  </motion.button>
                </div>

                {/* Suggestions */}
                <AnimatePresence>
                  {showTagSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-10 left-0 right-0 z-20 glass-strong rounded-xl overflow-hidden"
                      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {filteredSuggestions.map((t) => (
                        <motion.button
                          key={t}
                          whileHover={{ background: "rgba(255,255,255,0.06)" }}
                          className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 cursor-pointer"
                          style={{ color: TAG_COLORS[t] || "#4F8EF7" }}
                          onClick={() => addTag(t)}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: TAG_COLORS[t] || "#4F8EF7" }}
                          />
                          {t}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Meta info */}
            <div
              className="rounded-xl p-3 space-y-2"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <Clock size={11} />
                  Last edited
                </span>
                <span className="text-[var(--text-secondary)]">Just now</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Word count</span>
                <span className="text-[var(--text-secondary)]">
                  {description.split(" ").filter(Boolean).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">Nodes</span>
                <span className="text-[var(--accent-blue)]">
                  {activeNote.nodes?.length ?? 0}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Save button */}
      {activeNote && (
        <div className="p-4 border-t border-[var(--border-subtle)]">
          <motion.button
            className="save-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
            style={{
              background: saved
                ? "linear-gradient(135deg, #00F5A0, #00D4FF)"
                : "linear-gradient(135deg, #4F8EF7, #9B5DE5)",
              boxShadow: saved
                ? "0 0 20px rgba(0,245,160,0.3)"
                : "0 0 20px rgba(79,142,247,0.2)",
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 30px rgba(79,142,247,0.4)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
          >
            {saved ? (
              <>
                <CheckCircle2 size={15} className="text-white" />
                <span className="text-white">Saved!</span>
              </>
            ) : (
              <>
                <Save size={15} className="text-white" />
                <span className="text-white">Save FlowNote</span>
              </>
            )}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
