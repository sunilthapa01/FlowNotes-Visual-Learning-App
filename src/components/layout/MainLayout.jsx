import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import ThreeBackground from "../background/ThreeBackground";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FlowCanvas from "../flowchart/FlowCanvas";
import NoteEditor from "../editor/NoteEditor";
import EmptyState from "../empty/EmptyState";

export default function MainLayout() {
  const [activeNote, setActiveNote] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [hasNotes, setHasNotes] = useState(true);
  const [notes, setNotes] = useState([]);

  const handleCreateNote = () => {
    setHasNotes(true);
    const newNote = {
      id: Date.now(),
      title: "New FlowNote",
      tags: [],
      nodes: [],
    };
    setActiveNote(newNote);

    setNotes((prev) => [...prev, newNote]);
  };

  
  const handleSaveNote = (updatedNote) => {
    console.log("Saving note:", updatedNote);
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
    );
    console.log("check",notes);
    

    setActiveNote(updatedNote);
  };

  console.log("MainLayout rendered with activeNote:", activeNote);
  return (
    <div
      className="relative flex flex-col h-screen overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          background: [
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,142,247,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(155,93,229,0.06) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 60% at 70% 30%, rgba(0,212,255,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 70%, rgba(79,142,247,0.06) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(79,142,247,0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(155,93,229,0.06) 0%, transparent 60%)",
          ],
        }}

        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Three.js background */}
      <ThreeBackground />

      {/* App shell */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top navbar */}
        <Navbar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />

        {/* Main body */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden absolute top-3 left-3 z-20 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer glass"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Menu size={15} className="text-[var(--text-secondary)]" />
          </motion.button>

          {/* Sidebar */}
          <Sidebar
            activeNote={activeNote}
            onSelectNote={setActiveNote}
            onCreateNote={handleCreateNote}
            isOpen={sidebarOpen}
            notes={notes}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Center canvas / empty state */}
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
                  <FlowCanvas activeNote={activeNote} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right editor panel */}
            <AnimatePresence>
              {hasNotes && (
                <motion.div
                  key="editor"
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 60, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="hidden md:flex"
                >
                  <NoteEditor
                    activeNote={activeNote}
                    onSave={handleSaveNote}
                  />
                </motion.div>
              )}  
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
