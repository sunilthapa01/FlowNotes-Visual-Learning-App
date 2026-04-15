import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import NeuralBackground from "../background/NeuralBackground";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FlowCanvas from "../flowchart/FlowCanvas";
import NoteEditor from "../editor/NoteEditor";
import EmptyState from "../empty/EmptyState";

export default function MainLayout() {
  const [activeNote,   setActiveNote]   = useState(null);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [isDark,       setIsDark]       = useState(() => {
    // Persist theme across reloads
    return localStorage.getItem("fn-theme") !== "light";
  });
  const [hasNotes,     setHasNotes]     = useState(true);
  const [notes,        setNotes]        = useState([]);
  const [searchQuery,  setSearchQuery]  = useState("");

  // Apply theme class to <html> — drives all CSS variable switches
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("light");
      localStorage.setItem("fn-theme", "dark");
    } else {
      root.classList.add("light");
      localStorage.setItem("fn-theme", "light");
    }
  }, [isDark]);

  // ── Filtered notes for search ──────────────────────────────────────
  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((note) => {
      const inTitle = note.title?.toLowerCase().includes(q);
      const inDesc  = note.description?.toLowerCase().includes(q);
      const inTags  = note.tags?.some((t) => t.toLowerCase().includes(q));
      return inTitle || inDesc || inTags;
    });
  }, [notes, searchQuery]);

  // ── Note CRUD ─────────────────────────────────────────────────────
  const handleCreateNote = () => {
    setHasNotes(true);
    const newNote = {
      id:          Date.now(),
      title:       "New FlowNote",
      description: "",
      tags:        [],
      nodes:       [],
      connections: [],
    };
    setActiveNote(newNote);
    setNotes((prev) => [...prev, newNote]);
  };

  const handleSaveNote = (updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
    setActiveNote(updatedNote);
  };

  return (
    <div
      className="relative flex flex-col h-screen overflow-hidden theme-transition"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Neural network background */}
      <NeuralBackground isDark={isDark} />

      {/* Subtle color overlay that complements neural bg */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: isDark
            ? [
                "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,142,247,0.05) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 75% 30%, rgba(155,93,229,0.05) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,142,247,0.05) 0%, transparent 60%)",
              ]
            : [
                "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,142,247,0.04) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 75% 30%, rgba(155,93,229,0.04) 0%, transparent 60%)",
                "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,142,247,0.04) 0%, transparent 60%)",
              ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* App shell */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Navbar — gets search query setter + theme controls */}
        <Navbar
          isDark={isDark}
          onThemeToggle={() => setIsDark((d) => !d)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main body */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile hamburger */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden absolute top-3 left-3 z-20 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer glass"
          >
            <Menu size={15} className="text-[var(--text-secondary)]" />
          </motion.button>

          {/* Sidebar — receives filtered notes */}
          <Sidebar
            activeNote={activeNote}
            onSelectNote={setActiveNote}
            onCreateNote={handleCreateNote}
            isOpen={sidebarOpen}
            notes={filteredNotes}
            searchQuery={searchQuery}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Canvas / empty state */}
          <div className="flex-1 flex overflow-hidden min-w-0">
            <AnimatePresence mode="wait">
              {!hasNotes ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex items-center justify-center"
                >
                  <EmptyState onCreateNote={handleCreateNote} />
                </motion.div>
              ) : (
                <motion.div
                  key="canvas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex overflow-hidden min-w-0"
                >
                  <FlowCanvas activeNote={activeNote} onSave={handleSaveNote} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right editor panel */}
            <AnimatePresence>
              {hasNotes && (
                <motion.div
                  key="editor"
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0,  opacity: 1 }}
                  exit={{ x: 60,    opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="hidden md:flex"
                >
                  <NoteEditor activeNote={activeNote} onSave={handleSaveNote} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
