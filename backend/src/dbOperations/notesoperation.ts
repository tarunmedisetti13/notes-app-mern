// dbOperations/noteOperations.ts
import Note, { INote } from "../models/noteModel";

/**
 * Create a new note
 */
export const createNote = async (title: string, content: string, userId: string): Promise<INote> => {
    const note = await Note.create({ title, content, userId });
    return note;
};

/**
 * Get all notes for a user
 */
export const getNotesByUser = async (userId: string): Promise<INote[]> => {
    return await Note.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Get a single note by ID (only if it belongs to the user)
 */
export const getNoteById = async (noteId: string, userId: string): Promise<INote | null> => {
    return await Note.findOne({ _id: noteId, userId });
};

/**
 * Update a note
 */
export const updateNote = async (
    noteId: string,
    userId: string,
    title: string,
    content: string
): Promise<INote | null> => {
    return await Note.findOneAndUpdate(
        { _id: noteId, userId },
        { title, content },
        { new: true }
    );
};

/**
 * Delete a note
 */
export const deleteNote = async (noteId: string, userId: string): Promise<INote | null> => {
    return await Note.findOneAndDelete({ _id: noteId, userId });
};
