import React, { useState, useEffect } from "react";
import "./App.css";
import saveIcon from "./diskette.png";
import deleteIcon from "./delete.png";
import editIcon from "./edit.png";
import menuIcon from "./menu.png";
import starredIcon from "./activeStar.png";
import unstarredIcon from "./star.png"; // Add an unstarred icon

function App() {
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem("notes")) || []);
  const [currentNote, setCurrentNote] = useState("");
  const [settingsState, setSettingsState] = useState({});
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNoteText, setEditedNoteText] = useState("");



  useEffect(() => {
    // Save notes to localStorage whenever notes state changes
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (editingNoteId !== null) {
        handleSaveEdit(editingNoteId);
      } else {
        handleSave();
      }
    }
  };

  const handleSave = () => {
    if (currentNote.trim() !== "") {
      const newNote = {
        id: notes.length + 1,
        text: currentNote,
        starred: false,
      };
      const updatedNotes = [newNote, ...notes];
      const sortedNotes = sortNotes(updatedNotes);
      setNotes(sortedNotes);
      setCurrentNote("");
    }
  };

  const handleChange = (event) => {
    setCurrentNote(event.target.value);
  };

  const toggleSettings = (id) => {
    setSettingsState((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const startEditing = (id) => {
    setEditingNoteId(id);
    setEditedNoteText(notes.find((note) => note.id === id).text);
  };

  const handleSaveEdit = (id) => {
    if (editingNoteId === id && editedNoteText.trim() !== "") {
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, text: editedNoteText } : note
      );
      setNotes(sortNotes(updatedNotes));
      setEditingNoteId(null);
      setEditedNoteText("");
    }
  };

  const handleDelete = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const toggleStar = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, starred: !note.starred } : note
    );
    setTimeout(() => {
      const sortedNotes = sortNotes(updatedNotes);
      setNotes(sortedNotes);
    }, 100); // 100 milliseconds
  };

  const sortNotes = (notes) => {
    return notes.sort((a, b) => {
      if (a.starred !== b.starred) {
        return b.starred - a.starred;
      }
      return b.id - a.id;
    });
  };

  const columns = [[], [], []];
  notes.forEach((note, index) => {
    columns[index % 3].push(note);
  });

  return (
    <div className="notepad-container">
      <div className="textarea-container">
        <div className="textarea-wrapper">
          <textarea
            placeholder="Notepad"
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            value={currentNote}
          />
          <div className="save-button" onClick={handleSave}>
            <img src={saveIcon} alt="Save" />
          </div>
        </div>

        <div className="notes-list">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="column">
              {column.map((note) => (
                <div key={note.id} className="note-container">
                  {editingNoteId === note.id ? (
                    <textarea
                      value={editedNoteText}
                      onChange={(e) => setEditedNoteText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      autoFocus
                    />
                  ) : (
                    <div className="note">{note.text}</div>
                  )}
                  <div className="note-button-container">
                    <div
                      className="note-button settings-button"
                      onClick={() => toggleSettings(note.id)}
                    >
                      <img src={menuIcon} alt="Settings" />
                    </div>
                    <div
                      className={`note-button edit-button ${
                        settingsState[note.id] ? "active-edit-button" : ""
                      }`}
                      onClick={() => {
                        editingNoteId !== note.id
                          ? startEditing(note.id)
                          : handleSaveEdit(editingNoteId);
                      }}
                    >
                      <img
                        src={editingNoteId !== note.id ? editIcon : saveIcon}
                        alt="Edit"
                      />
                    </div>
                    <div
                      className={` ${
                        note.starred
                          ? "note-button display-none"
                          : settingsState[note.id]
                          ? "note-button active-delete-button delete-button"
                          : "note-button delete-button"
                      }`}
                      onClick={() => handleDelete(note.id)}
                    >
                      <img src={deleteIcon} alt="Delete" />
                    </div>
                    <div
                      className={` ${
                        note.starred
                          ? "note-button active-starred-button star-button"
                          : settingsState[note.id]
                          ? "note-button active-star-button star-button"
                          : "note-button star-button"
                      }`}
                      onClick={() => toggleStar(note.id)}
                    >
                      <img
                        src={note.starred ? starredIcon : unstarredIcon}
                        alt="Star"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
