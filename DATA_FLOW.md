# 🌊 Data Flow Documentation

This document explains how data moves through the FlowNotes application, helping you understand the architecture, state management, and "Add Node" lifecycle.

## 1. App Architecture Overview

The application follows a **"Lifted State"** pattern where the main data resides in the top-level layout component.

- **MainLayout.jsx**: The **State Owner**. It holds the source of truth for all notes and the currently active note.
- **Sidebar.jsx**: Displays the list of notes and handles note selection/creation.
- **FlowCanvas.jsx**: The visual engine. It renders nodes/arrows and handles canvas-specific logic (dragging, adding nodes).
- **NoteEditor.jsx**: Sidebar-based editor for modifying the title and metadata of the active note.

---

## 2. Data Structure

The application's core data is represented as an array of Note objects.

```json
{
  "notes": [
    {
      "id": 123456789,
      "title": "My Flowchart",
      "description": "Project overview",
      "tags": ["design", "ui"],
      "nodes": [
        { "id": "n1", "type": "start", "x": 100, "y": 100, "title": "Start" }
      ],
      "connections": [
        { "id": "c1", "from": "n1", "to": "n2" }
      ]
    }
  ],
  "activeNote": { ...currently selected note object... }
}
```

---

## 3. General Data Flow

The application uses **Props** to pass data down and **Callbacks** to send updates back up.

**User Action** → **Callback Function** → **State Update (Parent)** → **Prop Update (Child)** → **UI Re-render**

### Example: Selecting a Note
1.  **User** clicks a note in the `Sidebar`.
2.  `Sidebar` calls `onSelectNote(note)`.
3.  `MainLayout` (Parent) runs `setActiveNote(note)`.
4.  React re-renders `MainLayout`.
5.  `FlowCanvas` and `NoteEditor` receive the updated `activeNote` prop and update their display.

---

## 4. Add Node Flow (Internal Lifecycle) 🔥

This is the most complex data movement in the app. Here is the step-by-step:

1.  **Trigger**: User clicks a Node Type (e.g., "Process") in the `FlowCanvas` side panel.
2.  **Logic**: `FlowCanvas.jsx` runs the `handleAddNode` function.
3.  **Creation**: 
    - A `newNode` object is created with a unique ID and calculated `x, y` position.
    - If other nodes exist, a `newConn` (connection) is automatically generated to link the previous node to the new one.
4.  **Lifting State**: `FlowCanvas` does **not** update its own state. Instead, it calls:
    ```javascript
    onSave({ 
      ...activeNote, 
      nodes: [...activeNote.nodes, newNode],
      connections: [...activeNote.connections, ...newConn]
    });
    ```
5.  **State Synthesis**: In `MainLayout`, `handleSaveNote` receives this updated object:
    - It updates the `notes` array (searching for the ID and replacing the old note).
    - It updates the `activeNote` state.
6.  **Broadcast**: React updates the `activeNote` prop for **all** children.
7.  **Final Render**: `FlowCanvas` receives the new list of nodes via props, maps through them, and renders the new `FlowNode` on the canvas.

---

## 5. Props Flow Detail

| Component | Props Received | Purpose |
| :--- | :--- | :--- |
| **Sidebar** | `notes`, `activeNote` | To list all items and highlight the current selection. |
| **FlowCanvas** | `activeNote` | To render the specific nodes and connections of the current note. |
| **NoteEditor** | `activeNote` | To display the title/description for editing. |
| **All Children** | Callbacks (`onSave`, `onSelect`) | To request data changes from the Parent (`MainLayout`). |

---

## 6. State Management Summary

- **useState**: Used in `MainLayout` to manage the lifecycle of notes.
- **setNotes**: Replaces the entire array of notes. We always treat state as **immutable** (using `[...]` spread operators).
- **setActiveNote**: Updates which note is currently "in focus" on the canvas.
- **onSave**: The "bridge" function that children use to persist changes made inside the canvas back to the main data store.

---

## 7. How the UI Stays in Sync

React's **Declarative** nature means we don't "manually" draw nodes.
1. We update the **Data** (activeNote.nodes).
2. React notices the data changed.
3. `FlowCanvas` re-runs its `render` logic.
4. The `.map()` function in `FlowCanvas` generates the new `FlowNode` components automatically.

**Data First → UI Follows.**
