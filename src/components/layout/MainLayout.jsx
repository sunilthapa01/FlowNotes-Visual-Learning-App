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
  const [sidebarOpen,  setSidebarOpen]  = useState(true); // Default to true on desktop
  const [hasNotes,     setHasNotes]     = useState(true);
  const [notes,        setNotes]        = useState([]);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [isMobile,     setIsMobile]     = useState(false);

  // Check for desktop-only requirement (992px)
  useEffect(() => {
    const checkWidth = () => {
      setIsMobile(window.innerWidth < 1220);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

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
      <NeuralBackground />

      {/* Subtle color overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,142,247,0.05) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 60% at 75% 30%, rgba(155,93,229,0.05) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,142,247,0.05) 0%, transparent 60%)",
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* App shell */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Navbar */}
        <Navbar />

        {/* Main body */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Sidebar — receives filtered notes */}
          <Sidebar
            activeNote={activeNote}
            onSelectNote={setActiveNote}
            onCreateNote={handleCreateNote}
            notes={filteredNotes}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="flex-1 flex flex-row overflow-hidden min-w-0">
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

            {/* Editor panel */}
            <AnimatePresence>
              {hasNotes && (
                <motion.div
                  key="editor"
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0,  opacity: 1 }}
                  exit={{ x: 60,    opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="flex w-80 xl:w-96 border-l border-[var(--border-subtle)]"
                >
                  <NoteEditor activeNote={activeNote} onSave={handleSaveNote} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Desktop only Warning Popup */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080B14]/90 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass max-w-md w-full p-8 rounded-3xl border border-white/10 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                <Menu className="text-blue-400 rotate-90" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Desktop Version Only</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                FlowNotes is a professional-grade visual learning tool designed exclusively for large screens. Please switch to a desktop device for the best experience.
              </p>
              <div className="text-xs font-mono text-blue-400/60 uppercase tracking-widest">
                Screen width under 1220px detected
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
