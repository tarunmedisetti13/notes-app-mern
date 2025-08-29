// routes/notesRoutes.ts
import express, { Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import {
    createNote,
    getNotesByUser,
    getNoteById,
    updateNote,
    deleteNote,
} from '../dbOperations/notesoperation'

const router = express.Router();

/**
 * Create Note
 */
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ error: "Title and content required" });

        const note = await createNote(title, content, req.user!.id);
        res.json({ message: "Note created", note });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Get All Notes
 */
router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const notes = await getNotesByUser(req.user!.id);
        res.json({ notes });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Get Single Note
 */
router.get("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const note = await getNoteById(req.params.id, req.user!.id);
        if (!note) return res.status(404).json({ error: "Note not found" });

        res.json({ note });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Update Note
 */
router.put("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        const note = await updateNote(req.params.id, req.user!.id, title, content);

        if (!note) return res.status(404).json({ error: "Note not found or not yours" });
        res.json({ message: "Note updated", note });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * Delete Note
 */
router.delete("/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const note = await deleteNote(req.params.id, req.user!.id);
        if (!note) return res.status(404).json({ error: "Note not found or not yours" });

        res.json({ message: "Note deleted" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
