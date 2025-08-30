import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

interface Note {
    _id: string;
    title: string;
    content: string;
}
const Notes: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState<() => void>(() => { });

    // Fetch notes
    useEffect(() => {
        const fetchNotes = async () => {
            const res = await api.get("/notes");
            setNotes(res.data.notes);
        };
        fetchNotes();
    }, []);

    // Add new note
    const addNote = async () => {
        if (!title || !content) return;
        const res = await api.post("/notes", { title, content });
        setNotes([res.data.note, ...notes]);
        setTitle("");
        setContent("");
    };

    // Open edit modal
    const startEdit = (note: Note) => {
        setEditingNote(note);
        setShowEditModal(true);
    };

    // Update note
    const updateNote = async () => {
        if (!editingNote) return;
        const res = await api.put(`/notes/${editingNote._id}`, {
            title: editingNote.title,
            content: editingNote.content,
        });
        setNotes(notes.map((n) => (n._id === editingNote._id ? res.data.note : n)));
        setEditingNote(null);
        setShowEditModal(false);
    };

    // Open delete confirmation modal
    const confirmDelete = (id: string) => {
        setConfirmMessage("Are you sure you want to delete this note?");
        setConfirmAction(() => async () => {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((n) => n._id !== id));
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    // Logout confirmation modal
    const handleLogout = () => {
        setConfirmMessage("Do you want to logout?");
        setConfirmAction(() => () => {
            localStorage.removeItem("token"); // your logout logic
            window.location.href = "/login";
        });
        setShowConfirmModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 mt-14">
            <Navbar onLogout={handleLogout} />

            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    ✍️ My Notes
                </h2>

                {/* Add Note Form */}
                <div className="bg-white/90 shadow-xl rounded-xl p-5 mb-8 backdrop-blur">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        rows={4}
                        className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <button
                        onClick={addNote}
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
                    >
                        Add Note
                    </button>
                </div>

                {/* Notes List */}
                <h3 className="text-xl font-semibold text-gray-700 mb-4">📒 Your Notes</h3>
                {notes.length === 0 ? (
                    <p className="text-gray-600 text-center">No notes yet. Start writing!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {notes.map((n) => (
                            <div
                                key={n._id}
                                className="bg-white/90 shadow-md rounded-xl p-4 hover:shadow-2xl transition backdrop-blur"
                            >
                                <h4 className="font-bold text-lg text-gray-800">{n.title}</h4>
                                <p className="text-gray-600 mb-3">{n.content}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEdit(n)}
                                        className="flex-1 bg-yellow-400 text-white py-1 rounded-md hover:bg-yellow-500 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(n._id)}
                                        className="flex-1 bg-red-500 text-white py-1 rounded-md hover:bg-red-600 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Note Modal */}
            {showEditModal && editingNote && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
                        <h3 className="text-xl font-semibold mb-4">Edit Note</h3>
                        <input
                            value={editingNote.title}
                            onChange={(e) =>
                                setEditingNote({ ...editingNote, title: e.target.value })
                            }
                            placeholder="Title"
                            className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <textarea
                            value={editingNote.content}
                            onChange={(e) =>
                                setEditingNote({ ...editingNote, content: e.target.value })
                            }
                            rows={4}
                            placeholder="Content"
                            className="w-full p-2 mb-3 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={updateNote}
                                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Generic Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-lg w-80 text-center">
                        <p className="mb-4 text-gray-800">{confirmMessage}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => confirmAction()}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;
