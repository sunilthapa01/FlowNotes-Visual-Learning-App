# FlowNotes – Visual Flowchart Learning App

<div align="center">

![FlowNotes Banner](https://img.shields.io/badge/FlowNotes-Visual%20Learning%20App-4F8EF7?style=for-the-badge&logo=react&logoColor=white)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![GSAP](https://img.shields.io/badge/GSAP-Animation-88CE02?style=flat-square)](https://greensock.com/gsap/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

**A premium visual note-taking app where ideas become interactive flowcharts.**

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📚 Table of Contents

1. [Project Overview](#1--project-overview)
2. [Core Concept](#2--core-concept)
3. [Tech Stack Explained](#3--tech-stack-explained)
4. [Folder Structure](#4--folder-structure)
5. [Component Breakdown](#5--component-breakdown)
6. [Application Workflow](#6--application-workflow)
7. [Animations Deep Dive](#7--animations-deep-dive)
8. [UI Design Concepts](#8--ui-design-concepts)
9. [State Management](#9--state-management)
10. [How to Run the Project](#10--how-to-run-the-project)
11. [Best Practices Used](#11--best-practices-used)
12. [Future Improvements](#12--future-improvements)

---

## 1. 🚀 Project Overview

### What is FlowNotes?

FlowNotes is a **visual note-taking and flowchart-building application** built with React.js. Instead of writing plain text notes, users can **map their ideas visually** using connected nodes — just like drawing a flowchart on a whiteboard, but interactive and beautiful.

Think of it as **Notion + Lucidchart combined** — you can write a note AND visually map out the logic or thinking process behind it using different node types.

### 🔴 What Problem Does It Solve?

Most note apps store information as walls of text. Humans are **visual learners** — we understand things better when we can *see the connections* between ideas.

| Traditional Notes | FlowNotes |
|---|---|
| Plain text paragraphs | Visual node-based flowcharts |
| Hard to see connections | Clear arrows showing flow |
| One layout for everything | Node types: Start, Process, Decision, End |
| Boring to read | Animated, interactive, engaging |

### 💡 Why Is This Idea Unique?

Most tools do **either** notes **or** flowcharts — FlowNotes does **both together**, allowing you to:

- Write a note title and description (like Notion)
- Visually map out the idea using flowchart nodes (like draw.io)
- Tag notes for quick filtering
- Switch between notes while the canvas updates dynamically

### 🌍 Real-World Use Cases

| User | Use Case |
|---|---|
| **Student** | Map out how a concept works (e.g., bubble sort algorithm → flowchart) |
| **Developer** | Plan application architecture or API flow visually |
| **Teacher** | Create visual lesson plans that show information flow |
| **Product Manager** | Map user journeys and feature flows |
| **Recruiter** | Understand your project depth during technical interviews |

---

## 2. 🧠 Core Concept

> This is the most important section to understand before diving into the code.

### What is a "Note"?

A **Note** is the main container — like a file or a document. Each note has:

- A **title** (e.g., "How Bubble Sort Works")
- A **description** (more context about the topic)
- A list of **tags** (e.g., `algorithm`, `sorting`)
- A collection of **nodes** (the visual flowchart blocks)

```
Note = {
  id: "note-001",
  title: "How Bubble Sort Works",
  description: "Step-by-step explanation of bubble sort",
  tags: ["algorithm", "sorting"],
  nodes: [ ...all the flowchart blocks inside this note ]
}
```

### What are "Nodes"?

**Nodes** are the individual blocks inside a flowchart. Each node represents one **step or decision** in a process. There are 4 types:

| Node Type | Color | Meaning | Shape |
|---|---|---|---|
| **Start** | 🟢 Green | Beginning of the flow | Rounded / Pill |
| **Process** | 🔵 Blue | An action or step | Rectangle |
| **Decision** | 🟡 Orange | A yes/no branch point | Diamond |
| **End** | 🔴 Red | End of the flow | Rounded / Pill |

Each node has:
```
Node = {
  id: "node-001",
  type: "process",        // start | process | decision | end
  title: "Compare items",
  description: "Compare adjacent array elements"
}
```

### How a Note Contains Nodes

Think of a **Note** as a **folder** and **Nodes** as **files inside** that folder:

```
📁 Note: "Bubble Sort Algorithm"
  ├── 🟢 Node: Start — "Begin Sorting"
  ├── 🔵 Node: Process — "Compare adjacent elements"
  ├── 🟡 Node: Decision — "Is left > right?"
  ├── 🔵 Node: Process — "Swap the elements"
  └── 🔴 Node: End — "Array Sorted"
```

When you switch to a different note, the canvas clears and shows only the nodes belonging to that note.

### How Flowchart Visualization Works

The flowchart follows a simple rule: **Top to Bottom, Left to Right**. Nodes are connected by arrows that show the direction of the flow.

```
Simple Example:

[START] ──────────────────────────────────────┐
                                               ↓
[PROCESS]  Enter the number                   │
                                               ↓
[DECISION] Is number > 0?    ── No ──→ [PROCESS] Show "Negative"
                │                             ↓
              Yes                         [END]
                ↓
[PROCESS]  Show "Positive"
                ↓
             [END]
```

This flow maps directly to real code logic:

```js
function checkNumber(n) {
  // START
  if (n > 0) {           // DECISION
    console.log("Positive")  // PROCESS
  } else {
    console.log("Negative")  // PROCESS
  }
  // END
}
```

**FlowNotes lets you visualize logic like this — without writing a single line of code!**

---

## 3. 🧱 Tech Stack Explained

### ⚛️ React.js

**What it is:** A JavaScript library for building user interfaces using reusable pieces called **components**.

**Why used in this project:**
- The app has many interconnected UI pieces (Sidebar, Canvas, Editor, Navbar). React lets us build each piece independently and compose them together.
- React's **state system** is used to track which note is active, which nodes exist, etc.
- React re-renders only the parts of the UI that change (efficient updates when you add a node or switch notes).

**When to use React:** Any app with dynamic UI that changes based on user interaction.

**Example:**
```jsx
// A simple React component
function NodeCard({ title, type }) {
  return (
    <div className={`node node-${type}`}>
      <h3>{title}</h3>
    </div>
  )
}

// Used as:
<NodeCard title="Check Condition" type="decision" />
```

---

### 🎨 Tailwind CSS

**What it is:** A utility-first CSS framework. Instead of writing separate CSS files, you write styling directly inside your HTML/JSX using short class names.

**Why used in this project:**
- Speeds up styling dramatically — no switching between CSS files
- Responsive design is built-in with `sm:`, `md:`, `lg:` prefixes
- Consistent spacing, colors, and typography across the project
- Easy dark theme implementation

**When to use:** Any project where you want fast, consistent, responsive styling.

**Example:**
```jsx
// Traditional CSS
.card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 16px; }

// Tailwind equivalent — written directly in JSX:
<div className="bg-white/5 rounded-2xl p-4">
  Card Content
</div>
```

---

### 🧩 shadcn/ui

**What it is:** A collection of beautiful, accessible, and customizable UI components built on top of Radix UI primitives.

**Why used in this project:**
- Provides production-ready components like `Dialog`, `Button`, `Input` without building from scratch
- Components are **unstyled at the core** — you control 100% of the look with Tailwind
- Accessibility is handled automatically (keyboard navigation, ARIA labels)

**When to use:** When you need complex UI patterns (modals, dropdowns, tooltips) that are accessible and customizable.

**Example:**
```jsx
import * as Dialog from '@radix-ui/react-dialog'

<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 bg-white rounded-xl p-6">
      <Dialog.Title>Add New Node</Dialog.Title>
      {/* form fields */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

### 🎬 Framer Motion

**What it is:** A powerful animation library for React that makes adding smooth animations as simple as adding props to components.

**Why used in this project:**
- Node cards animate in with a spring bounce when added to the canvas
- Sidebar note cards slide in on hover
- Dialog modals fade and scale into view
- The layout transitions smoothly when notes are switched

**When to use:** For UI-level animations tied to component mounting, unmounting, or interaction (hover, tap, focus).

**Example:**
```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, scale: 0.8 }}   // starting state (invisible, small)
  animate={{ opacity: 1, scale: 1 }}     // end state (visible, normal size)
  exit={{ opacity: 0, scale: 0.8 }}      // when removed from DOM
  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
  whileHover={{ scale: 1.05 }}           // scale up on hover
>
  <NodeCard />
</motion.div>
```

---

### 🟩 GSAP (GreenSock Animation Platform)

**What it is:** A professional-grade JavaScript animation library used for complex, timeline-based, high-performance animations.

**Why used in this project:**
- Page load sequence (navbar slides down, sidebar slides in, nodes stagger in) — requires precise timing control
- Background gradient animation loops
- Stagger animations where each element animates one after another with a delay

**When to use:** When animations are complex (sequences, timelines, staggering) or need pixel-perfect control.

**Example:**
```js
import { gsap } from 'gsap'

// On page load: animate multiple nodes appearing one by one
gsap.fromTo(
  '.flow-node',             // target: all elements with this class
  { opacity: 0, y: 20 },   // from: invisible and shifted down
  {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,           // each node waits 0.1s longer than the previous
    ease: 'back.out(1.5)',  // bouncy ease effect
    delay: 0.6,             // wait 0.6s before starting
  }
)
```

---

### ⚡ Vite

**What it is:** A modern JavaScript build tool that starts your development server almost instantly and bundles your code for production.

**Why used:** Replaces Create React App. Significantly faster hot reload — changes appear in the browser in milliseconds, not seconds.

---

## 4. 📁 Folder Structure

```
/FlowNotes
│
├── public/                    # Static files served as-is
│   └── vite.svg
│
├── src/                       # All source code lives here
│   │
│   ├── components/            # Reusable UI building blocks
│   │   ├── layout/            # App-level structural components
│   │   │   ├── MainLayout.jsx    ← Assembles all panels together
│   │   │   ├── Navbar.jsx        ← Top bar with search, avatar
│   │   │   └── Sidebar.jsx       ← Left panel with note list
│   │   │
│   │   ├── flowchart/         # Canvas and node-related components
│   │   │   ├── FlowCanvas.jsx    ← The main drawing area
│   │   │   ├── FlowNode.jsx      ← Individual node card UI
│   │   │   ├── NodeConnector.jsx ← SVG arrows between nodes
│   │   │   └── AddNodeDialog.jsx ← Modal to create custom nodes
│   │   │
│   │   ├── editor/            # Note editing panel (right side)
│   │   │   └── NoteEditor.jsx    ← Title, description, tags, save
│   │   │
│   │   ├── background/        # Visual background effects
│   │   │   └── ThreeBackground.jsx ← Three.js floating particles
│   │   │
│   │   └── empty/             # Empty state UI
│   │       └── EmptyState.jsx    ← Shown when no notes exist
│   │
│   ├── lib/                   # Shared utility functions
│   │   └── utils.js              ← Helper: cn() for classnames
│   │
│   ├── index.css              # Global styles and design tokens
│   ├── App.jsx                # Root component
│   └── main.jsx               # Entry point — mounts React to DOM
│
├── index.html                 # HTML shell (React mounts here)
├── vite.config.js             # Vite configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

### 🗂️ Why This Folder Structure?

**`components/`** — Groups UI code by *responsibility*, not by file type. This is called "feature-based" structure and scales much better than putting all components in one flat folder.

**`layout/`** vs **`flowchart/`** vs **`editor/`** — Each subfolder owns a distinct *domain* of the app. If you need to change the canvas, you only touch `flowchart/`. This is the **Separation of Concerns** principle.

**`lib/`** — Utility functions that don't belong to any specific component. Placing them here prevents duplication.

**`index.css`** — All CSS custom properties (design tokens) live here so the entire app uses the same colors, spacing, and blur values — the single source of truth for design.

---

## 5. 🧩 Component Breakdown

### 🗂️ `Sidebar.jsx` — Notes Navigation Panel

**What it does:** Displays the list of all saved notes on the left side. Users can click any note to load it into the canvas and editor.

**Why it exists:** Provides navigation between notes without page reloads. It's the "file explorer" of FlowNotes.

**How it connects:**
- Receives `activeNote` (which note is currently selected)
- Calls `onSelectNote(note)` when a note card is clicked → parent updates active note
- Calls `onCreateNote()` when the "Create New Note" button is pressed

**Example (simplified):**
```jsx
function Sidebar({ activeNote, onSelectNote, onCreateNote }) {
  return (
    <div className="sidebar">
      <button onClick={onCreateNote}>+ Create New Note</button>

      {notes.map(note => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={note.id === activeNote?.id ? 'active' : ''}
        >
          {note.title}
        </div>
      ))}
    </div>
  )
}
```

**Animations:** GSAP slides the sidebar in from left (`x: -280 → 0`) on page load. Each note card staggers in with Framer Motion.

---

### 🖼️ `FlowCanvas.jsx` — The Flowchart Drawing Area

**What it does:** The central panel where nodes are displayed. Shows the flowchart belonging to the currently active note. Nodes can be dragged around the canvas.

**Why it exists:** This is the core feature of FlowNotes — the visual map of a note's ideas.

**How it connects:**
- Receives `activeNote` to know which note's nodes to display
- Contains the **Node Types Panel** (left sidebar inside the canvas)
- Renders `FlowNode` components for each node
- Renders SVG connector lines between nodes
- Opens `AddNodeDialog` when the FAB or "Custom" button is clicked

**Key features:**
- Dot-grid background (visual canvas feel)
- Zoom in / zoom out controls
- Node selection (click to select, shows delete button in toolbar)
- SVG curved dashed arrows connecting nodes

**Example (simplified):**
```jsx
function FlowCanvas({ activeNote }) {
  return (
    <div className="canvas dot-grid">
      <NodeTypesPanel onAddNode={handleAddNode} />

      {nodes.map(node => (
        <FlowNode key={node.id} {...node} />
      ))}

      <FABButton onClick={() => setDialogOpen(true)} />
      <AddNodeDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
```

---

### 🟦 `FlowNode.jsx` — Individual Node Card

**What it does:** Renders a single flowchart node block with its type badge, title, description, and visual styling.

**Why it exists:** Separating each node into its own component makes it easy to reuse, style per-type, and animate independently.

**How it connects:** Used inside `FlowCanvas.jsx`. Receives `type`, `title`, `description`, and `isDragging` as props.

**The 4 variants:**

```jsx
// Each type gets a unique color theme
const NODE_CONFIGS = {
  start:    { color: '#00F5A0', icon: Play,        label: 'START'    },
  process:  { color: '#4F8EF7', icon: Cpu,         label: 'PROCESS'  },
  decision: { color: '#FFB347', icon: HelpCircle,  label: 'DECISION' },
  end:      { color: '#FF6B6B', icon: Square,      label: 'END'      },
}

function FlowNode({ type, title, description }) {
  const config = NODE_CONFIGS[type]
  return (
    <motion.div
      whileHover={{ scale: 1.06 }}             // scale up on hover
      style={{ border: `1px solid ${config.color}` }}
    >
      <Badge color={config.color}>{config.label}</Badge>
      <h4>{title}</h4>
      <p>{description}</p>
    </motion.div>
  )
}
```

---

### 🎛️ `AddNodeDialog.jsx` — Custom Node Creation Modal

**What it does:** A 2-step modal dialog for creating a custom-configured node. Step 1 lets you pick the node type. Step 2 lets you enter a title and description.

**Why it exists:** The quick-click panel adds nodes instantly with defaults. The dialog gives users control to name their nodes properly before placing them.

**How it connects:** Opened by `FlowCanvas.jsx`. Uses Radix UI `Dialog` under the hood for accessibility (keyboard-dismissable, focus trap, ARIA).

**The 2-step flow:**
```
Step 1: [Start] [Process] [Decision] [End]  ← pick type
                      ↓ click "Next →"
Step 2: [Title input]
        [Description textarea]              ← name your node
                      ↓ click "Add Node"
        → Node is added to canvas
```

---

### 📝 `NoteEditor.jsx` — Right Panel Note Editor

**What it does:** The right-side panel for editing the active note's metadata — its title, long-form description, and tags.

**Why it exists:** Keeps the note's textual content separate from the visual canvas. This is the "writing" side of FlowNotes, complementing the "drawing" side.

**How it connects:**
- Receives `activeNote` from `MainLayout`
- Displays title/description/tags for the active note
- "Save" button (UI ready for your save logic)

**Tag system:**
```jsx
// Tags are stored as an array of strings
const [tags, setTags] = useState(['algorithm', 'sorting'])

// Each tag renders as a colored chip
{tags.map(tag => (
  <span key={tag} className="tag-chip">
    {tag} <button onClick={() => removeTag(tag)}>×</button>
  </span>
))}
```

---

### 🔝 `Navbar.jsx` — Top Navigation Bar

**What it does:** The fixed top bar containing the search input, theme toggle button, notification bell, and user avatar.

**Why it exists:** Provides global-level controls accessible from any screen state.

**How it connects:** Sits above all panels in `MainLayout`. Receives `isDark` and `onThemeToggle` from parent.

**GSAP entrance:** Slides down from `y: -60` on page load — creates that smooth "app is loading" feel.

---

### 🌌 `ThreeBackground.jsx` — Animated Particle Background

**What it does:** Renders a Three.js WebGL canvas behind the entire app with 220 slowly drifting colored particles and 6 floating wireframe geometric shapes.

**Why it exists:** Transforms the app from a flat UI into an immersive, premium experience. The particles create a "depth" effect without distracting from the content.

**How it works:**
```jsx
// Key Three.js concepts used:
// 1. BufferGeometry — stores particle positions as typed arrays (fast)
// 2. PointsMaterial — renders each position as a colored dot
// 3. requestAnimationFrame loop — updates positions every frame

const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const material = new THREE.PointsMaterial({ size: 1.6, vertexColors: true })
const particles = new THREE.Points(geometry, material)
```

---

## 6. 🔁 Application Workflow

### Flow 1: Creating a New Note

```
User clicks "Create New Note" (Sidebar)
        │
        ↓
onCreateNote() called → new note object created
        │
        ↓
Notes array updated → Sidebar re-renders with new note
        │
        ↓
New note set as activeNote → Canvas empties → Editor clears
        │
        ↓
User types title in NoteEditor → note.title updates
```

```
STATE BEFORE:                   STATE AFTER:
notes: [note1, note2]           notes: [note1, note2, note3 ← NEW]
activeNoteId: "note2"           activeNoteId: "note3"
```

---

### Flow 2: Adding a Node (via side panel)

```
User sees Node Types Panel (left side of canvas)
        │
        ↓
Hovers over "Process" → shimmer glow + "Click to add" tooltip
        │
        ↓
Clicks "Process" → handleAddNode('process') called
        │
        ↓
New node object created with default title + position
        │
        ↓
nodes array updated → FlowCanvas re-renders
        │
        ↓
New FlowNode animates in (spring scale: 0.4 → 1)
        │
        ↓
Node added to the active note's node list
```

---

### Flow 3: Adding a Node (via Custom Dialog)

```
User clicks FAB button (+) or "Custom" button
        │
        ↓
AddNodeDialog opens (motion.div animates in)
        │
        ↓
Step 1: User selects type → active card highlights with glow
        │
        ↓
Clicks "Next →" → Step 2 slides in
        │
        ↓
Step 2: User types title + description
        │
        ↓
Clicks "Add Node" → dialog closes → node spawns on canvas
```

---

### Flow 4: Switching Between Notes

```
User clicks a different note in the Sidebar
        │
        ↓
onSelectNote(note) called → activeNote state updates
        │
        ↓
FlowCanvas receives new activeNote prop → re-renders with new note's nodes
        │
        ↓
NoteEditor receives new activeNote → fields update with note's data
        │
        ↓
GSAP plays panel slide-in animation on editor (x: 40 → 0)
│
        ↓
Sidebar highlights the now-active note card
```

**Visual:**
```
  Sidebar          Canvas              Editor
 ─────────       ─────────────       ──────────
 [Note 1] ←now  [Node A]            Title: "Note 1"
 [Note 2]*      [Node B]  [Node C]  Tags: [dev]

                     User clicks Note 2
                           ↓

 [Note 1]       [Node X]            Title: "Note 2"
 [Note 2] ←now  [Node Y]            Tags: [design]
```

---

## 7. 🎬 Animations Deep Dive

### Framer Motion — UI Interaction Layer

Framer Motion handles **component-level animations** — things tied directly to React's rendering cycle.

**Where it's used in FlowNotes:**

| Location | Animation |
|---|---|
| Node cards | `whileHover: scale(1.06)` + glow ring |
| Sidebar note cards | `whileHover: scale(1.015), x: 3` |
| FAB button | `whileHover: scale(1.12)` + glow |
| Dialog | `initial: scale(0.88)` → `animate: scale(1)` spring |
| Tag chips | `initial: scale(0)` → `animate: scale(1)` spring |
| Node entry | `initial: opacity/scale(0)` → `animate: opacity/scale(1)` |
| Save button | Transitions from blue to green on save |
| `AnimatePresence` | Nodes animate out when deleted |

**Core concept — `AnimatePresence`:**
```jsx
// This is what makes exit animations work in React
// Without it, components just disappear instantly when removed from the DOM

<AnimatePresence>
  {nodes.map(node => (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5 }}   // plays when node is removed
    >
      <FlowNode {...node} />
    </motion.div>
  ))}
</AnimatePresence>
```

---

### GSAP — Orchestrated Page Animations

GSAP handles **timeline-based, sequenced animations** — things that need precise timing control across multiple elements.

**Where it's used in FlowNotes:**

| Location | Animation |
|---|---|
| Navbar | Slide down from `y: -60` on mount |
| Sidebar | Slide in from `x: -280` on mount |
| Note cards | Stagger slide-in (`stagger: 0.07s`) |
| Flow nodes | Stagger scale-in (`stagger: 0.1s, back.out(1.5)`) |
| Note editor panel | Slide from `x: 40` when note selected |

**The stagger concept:**
```js
// Without stagger: all elements animate at the same time (boring)
// With stagger: each element waits a little longer — creates a "cascade" feel

gsap.fromTo(
  '.note-card',                // all note cards
  { x: -30, opacity: 0 },     // start: off-screen left, invisible
  {
    x: 0,
    opacity: 1,
    duration: 0.5,
    stagger: 0.07,             // card 1 starts at 0ms
                               // card 2 starts at 70ms
                               // card 3 starts at 140ms → cascade!
    ease: 'power2.out',
    delay: 0.5,
  }
)
```

---

### ⚖️ Framer Motion vs GSAP — Comparison

| Feature | Framer Motion | GSAP |
|---|---|---|
| **Best for** | React component animations | Complex, sequenced animations |
| **API style** | Props on JSX elements | JavaScript function calls |
| **React aware** | ✅ Yes — triggers on mount/unmount | ❌ Manual DOM refs required |
| **Timeline support** | Limited | ✅ Full timeline control |
| **Stagger control** | Basic | ✅ Precise stagger timing |
| **Spring physics** | ✅ Built-in | Requires plugin |
| **Performance** | Good | ✅ Industry-leading |
| **Exit animations** | ✅ AnimatePresence | Manual cleanup |
| **Learning curve** | Lower | Higher |

**Rule of thumb used in this project:**
> Use **Framer Motion** for anything tied to user interaction (hover, click, component mount/unmount).
> Use **GSAP** for page-load sequences and anything needing precise timing across multiple elements.

---

## 8. 🎨 UI Design Concepts

### 🪟 Glassmorphism

**What it is:** A design trend that makes UI elements look like frosted glass — semi-transparent with a blur effect behind them.

**Why used:**
- Creates visual depth (layers feel like they're floating above the background)
- Looks premium and modern
- Works beautifully with the animated particle background — you can see particles through the panels

**How it's implemented:**
```css
.glass {
  background: rgba(255, 255, 255, 0.04);   /* very transparent white */
  backdrop-filter: blur(20px);              /* blur what's behind */
  -webkit-backdrop-filter: blur(20px);      /* Safari support */
  border: 1px solid rgba(255, 255, 255, 0.08); /* subtle light border */
}
```

---

### 🌑 Dark Theme

**Why dark by default:**
- Reduces eye strain during long coding/study sessions
- Makes colors and glows pop dramatically (neon glow on dark = ✨)
- Perceived as more professional/technical
- Better battery life on OLED screens

**Color system:**
```css
:root {
  --bg-primary: #080B14;      /* near-black deep navy base */
  --text-primary: #E8EAF0;    /* off-white for readability */
  --text-muted: #6B7280;      /* gray for secondary info */
  --accent-blue: #4F8EF7;     /* primary action color */
  --accent-purple: #9B5DE5;   /* secondary gradient color */
  --accent-cyan: #00D4FF;     /* highlight color */
}
```

---

### 🌈 Gradient System

Every interactive element uses gradients instead of flat colors:
- **Primary actions:** `linear-gradient(135deg, #4F8EF7, #9B5DE5)` (blue → purple)
- **Success states:** `linear-gradient(135deg, #00F5A0, #00D4FF)` (green → cyan)
- **Logo / brand:** Blue → Purple gradient text

This gives the UI a **dynamic, alive feeling** and makes buttons immediately recognizable as clickable.

---

### 📱 Responsive Design

| Breakpoint | Behavior |
|---|---|
| `< 768px` (mobile) | Sidebar hidden, accessible via hamburger menu overlay |
| `768px–1024px` (tablet) | Sidebar and canvas, editor hidden |
| `> 1024px` (desktop) | Full three-panel layout (sidebar + canvas + editor) |

Built with Tailwind's responsive prefixes:
```jsx
<div className="
  hidden           /* hidden by default (mobile) */
  md:flex          /* visible as flex on tablet+ */
  lg:w-96          /* wider on desktop */
">
  <NoteEditor />
</div>
```

---

## 9. 💾 State Management

### How It Works

FlowNotes uses **React's built-in `useState`** for state management. All state lives in `MainLayout.jsx` (the parent component) and is passed down as props.

### The State Shape

```js
// In MainLayout.jsx
const [activeNote, setActiveNote] = useState(null)
const [isDark, setIsDark]         = useState(true)
const [hasNotes, setHasNotes]     = useState(true)

// Future: full state with all notes
const [notes, setNotes] = useState([
  {
    id: "note-001",
    title: "Bubble Sort Algorithm",
    description: "Visual explanation of bubble sort",
    tags: ["algorithm", "sorting"],
    nodes: [
      {
        id: "node-001",
        type: "start",
        title: "Begin",
        description: "Start the sort",
        x: 120,     // canvas position
        y: 80,
      },
      {
        id: "node-002",
        type: "process",
        title: "Compare elements",
        description: "Check if left > right",
        x: 360,
        y: 80,
      }
      // ...
    ]
  }
])

const [activeNoteId, setActiveNoteId] = useState(null)
const activeNote = notes.find(n => n.id === activeNoteId)
```

### Data Flow (Unidirectional)

React follows a strict **top-down data flow** — data goes from parent to child via props:

```
MainLayout (STATE OWNER)
    │
    ├──→ Sidebar     (receives: notes, activeNote → shows note list)
    │
    ├──→ FlowCanvas  (receives: activeNote → shows its nodes)
    │
    └──→ NoteEditor  (receives: activeNote → shows its title/tags)
```

Events flow **up** via callback functions:
```
User clicks note in Sidebar
    → onSelectNote(note) callback fires
        → MainLayout: setActiveNote(note)
            → Canvas + Editor re-render with new note
```

### 🔮 Extending to Redux or LocalStorage

When the app grows, you can:

**LocalStorage (persist across browser sessions):**
```js
// Save to localStorage whenever notes change
useEffect(() => {
  localStorage.setItem('flownotes', JSON.stringify(notes))
}, [notes])

// Load from localStorage on first render
const [notes, setNotes] = useState(() => {
  const saved = localStorage.getItem('flownotes')
  return saved ? JSON.parse(saved) : []
})
```

**Redux (for large-scale state):**
```js
// actions
const addNode    = (noteId, node) => ({ type: 'ADD_NODE',    payload: { noteId, node } })
const deleteNode = (noteId, nodeId) => ({ type: 'DELETE_NODE', payload: { noteId, nodeId } })
const switchNote = (noteId) => ({ type: 'SWITCH_NOTE',  payload: noteId })
```

---

## 10. ▶️ How to Run the Project

### Prerequisites

Make sure you have these installed:
```bash
node --version   # v18 or higher
npm --version    # v9 or higher
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/flownotes.git
cd flownotes
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all libraries listed in `package.json`:
- `react`, `react-dom` — core React
- `framer-motion` — UI animations
- `gsap` — advanced animations
- `three` — 3D particle background
- `@radix-ui/react-dialog` — accessible modal
- `lucide-react` — icon library
- `tailwindcss` — utility CSS

### Step 3: Start the Development Server

```bash
npm run dev
```

You should see:
```
  VITE v8.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Open `http://localhost:5173` in your browser. **That's it!** 🎉

### Step 4: Build for Production

```bash
npm run build
```

This creates an optimized `/dist` folder ready for deployment to Vercel, Netlify, or any static host.

### Project Quick Reference

```bash
npm run dev      # start development server (hot reload)
npm run build    # create production build
npm run preview  # preview the production build locally
```

---

## 11. 🧼 Best Practices Used

### ✅ Component Reusability

Each component is built to do **one thing well** and accept props for customization:

```jsx
// FlowNode is reusable for all 4 types
<FlowNode type="start"    title="Begin"    description="Entry" />
<FlowNode type="process"  title="Sort"     description="Step"  />
<FlowNode type="decision" title="Done?"    description="Check" />
<FlowNode type="end"      title="Complete" description="Exit"  />
```

### ✅ Separation of Concerns

- `components/layout/` — handles structure
- `components/flowchart/` — handles canvas logic
- `components/editor/` — handles note editing
- `index.css` — handles all design tokens
- `lib/utils.js` — handles shared utilities

Each file has a **single responsibility**. When something breaks, you know exactly where to look.

### ✅ Prop-driven Design

Components don't manage data they don't own. `FlowCanvas` doesn't store which note is active — it receives it as a prop. This makes components predictable and testable.

### ✅ Clean Naming Conventions

```
Components: PascalCase     → FlowNode, NoteEditor, AddNodeDialog
Functions:  camelCase      → handleAddNode, getNodeById, resetAndClose
Constants:  UPPER_SNAKE    → DEMO_NODES, NODE_TYPE_CATALOGUE
CSS vars:   kebab-case     → --accent-blue, --text-muted, --bg-primary
```

### ✅ Performance Considerations

- `useCallback` on drag handlers to prevent recreation every render
- Three.js cleanup via `useEffect` return function (prevents memory leaks)
- `AnimatePresence` handled at the list level, not globally
- Vite's code splitting (components load on demand in production)

---

## 12. 🚀 Future Improvements

| Feature | Description | Complexity |
|---|---|---|
| **Real drag-and-drop** | Use `react-dnd` or `@dnd-kit` for full drag support between panels | Medium |
| **Live node connections** | Click-and-drag between nodes to draw arrows dynamically | High |
| **Export to JSON** | Download your note + nodes as a portable `.json` file | Low |
| **Export to PDF** | Use `html2canvas` + `jsPDF` to export canvas as PDF | Medium |
| **LocalStorage persistence** | Notes survive browser refresh | Low |
| **Backend integration** | Node.js + MongoDB to save notes to a database | High |
| **Real-time collaboration** | WebSockets (Socket.io) for multiple users editing simultaneously | Very High |
| **Node templates** | Pre-built flowchart templates (e.g., Login Flow, CRUD Flow) | Medium |
| **Search/filter nodes** | Search nodes by title across all notes | Low |
| **Undo / Redo** | Command pattern to reverse canvas actions | Medium |

---

## 👨‍💻 Author

**Sunil**
- Built with passion for visual learning and modern frontend development
- Stack showcase: React · Tailwind · Framer Motion · GSAP · Three.js

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**⭐ If this project helped you, please consider starring it on GitHub!**

*Built with ❤️ and a lot of ☕*

</div>
