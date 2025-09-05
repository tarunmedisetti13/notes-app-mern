import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { FaPlus } from "react-icons/fa";
import { FaTrash, FaEdit } from "react-icons/fa";
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
    const [showAddModal, setShowAddModal] = useState(false);

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
        setShowAddModal(false);
    };

    // Edit modal
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

    // Delete confirm modal
    const confirmDelete = (id: string) => {
        setConfirmMessage("Are you sure you want to delete this note?");
        setConfirmAction(() => async () => {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter((n) => n._id !== id));
            setShowConfirmModal(false);
        });
        setShowConfirmModal(true);
    };

    // Logout confirm modal
    const handleLogout = () => {
        setConfirmMessage("Do you want to logout?");
        setConfirmAction(() => () => {
            localStorage.removeItem("token");
            window.location.href = "/login";
        });
        setShowConfirmModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E1E2F] to-[#2E2E4F] text-white mt-14">
            <Navbar onLogout={handleLogout} />

            <div className="max-w-4xl mx-auto px-4 pb-20">
                <h2 className="text-3xl font-bold mb-6 text-center">📝 My Notes</h2>

                {/* Notes List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {notes.map((n) => (
                        <div
                            key={n._id}
                            className="relative bg-[#333A5C]/90 shadow-lg rounded-2xl p-5 hover:shadow-2xl transition backdrop-blur border border-gray-600 h-40"
                        >
                            {/* Top-right action icons */}
                            <div className="absolute top-3 right-3 flex gap-2">
                                <button
                                    onClick={() => startEdit(n)}
                                    className="p-1 hover:text-yellow-400 transition cursor-pointer"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => confirmDelete(n._id)}
                                    className="p-1 hover:text-red-500 transition cursor-pointer"
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            <h4 className="font-bold text-lg text-white mb-2 overflow-hidden line-clamp-1">
                                {n.title}
                            </h4>
                            <p className="text-gray-300 text-sm overflow-hidden line-clamp-3 break-words">
                                {n.content}
                            </p>
                        </div>
                    ))}

                    {/* Add Note Card */}
                    <div
                        onClick={() => setShowAddModal(true)}
                        className="flex flex-col items-center justify-center cursor-pointer bg-[#333A5C]/90 shadow-lg rounded-2xl p-5 hover:shadow-2xl transition backdrop-blur border border-gray-600 h-40 text-white text-xl font-semibold"
                    >
                        <FaPlus size={24} className="mb-2" />
                        <span>Add New Note</span>
                    </div>
                </div>

            </div>

            {/* Floating + Button */}
            <button
                onClick={() => setShowAddModal(true)}
                className="fixed bottom-8 right-8 bg-purple-600 cursor-pointer  hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl transition flex items-center justify-center"
            >
                <FaPlus size={20} />
            </button>

            {/* Add Note Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#333A5C] text-white rounded-2xl p-6 shadow-lg w-80 mx-2">
                        <h3 className="text-xl font-semibold mb-4 text-center">➕ Add Note</h3>
                        <input
                            value={title}
                            maxLength={50}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className="w-full p-2 mb-3 bg-[#2A2F4F] text-white border border-gray-500 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                        />

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Content"
                            maxLength={200}
                            rows={4}
                            className="w-full font-normal p-2 mb-3 bg-[#2A2F4F] resize-none text-white border border-gray-500 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={addNote}
                                className="flex-1 cursor-pointer bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition shadow-md"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setTitle("");
                                    setContent("");
                                }}
                                className="flex-1 cursor-pointer bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Edit Note Modal */}
            {showEditModal && editingNote && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#333A5C] text-white rounded-2xl p-6 shadow-lg w-80 mx-2">
                        <h3 className="text-xl font-semibold mb-4 text-center">✏️ Edit Note</h3>
                        <input
                            value={editingNote.title}
                            onChange={(e) =>
                                setEditingNote({ ...editingNote, title: e.target.value })
                            }
                            maxLength={50}
                            placeholder="Title"
                            className="w-full p-2 mb-3 bg-[#2A2F4F] text-white border border-gray-500 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <textarea
                            value={editingNote.content}
                            onChange={(e) =>
                                setEditingNote({ ...editingNote, content: e.target.value })
                            }
                            maxLength={200}
                            rows={4}
                            placeholder="Content"
                            className="w-full p-2 mb-3 bg-[#2A2F4F] text-white border resize-none border-gray-500 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={updateNote}
                                className="bg-purple-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-400 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Generic Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#333A5C] text-white rounded-2xl p-6 shadow-lg w-80 text-center mx-2">
                        <p className="mb-4">{confirmMessage}</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => confirmAction()}
                                className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-gray-400 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
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
