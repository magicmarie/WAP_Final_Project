import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { readJSON, writeJSON } from "../fileHandler";
import { Comment, Post } from "../Interfaces";

// Zod Schema for Comment Validation
const commentSchema = z.object({
    postId: z.string(),
    author: z.string(),
    content: z.string().min(1),
});

// Fetch comments for a specific post
export const getComments: RequestHandler<{ postId: string }, Comment[] | { error: string }> = async (req, res) => {
    try {
        const { postId } = req.params;
        const comments: Comment[] = await readJSON("comments.json");
        const filteredComments = comments.filter((c) => c.postId === postId);

        res.json(filteredComments);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comments" });
    }
};

// Add a new comment to a post
export const addComment: RequestHandler<{ postId: string }, Comment | { error: string | z.ZodIssue[] }, { author: string; content: string }> = async (req, res): Promise<void> => {
    try {
        const validation = commentSchema.safeParse({ ...req.body, postId: req.params.postId });

        if (!validation.success) {
            res.status(400).json({ error: validation.error.errors });
            return;
        }

        const posts: Post[] = await readJSON("posts.json");
        const post = posts.find(post => post.id === req.params.postId);

        if(!post) {
            res.status(404).json({ error: "Post with that id does not exist" });
            return;
        }

        const comments: Comment[] = await readJSON("comments.json");
        const newComment: Comment = {
            id: uuidv4(),
            date: new Date().toISOString(),
            postId: req.params.postId,
            ...req.body,
        };

        comments.push(newComment);
        writeJSON("comments.json", comments);

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: "Error adding comment" });
    }
};

// Delete a comment
export const deleteComment: RequestHandler<{ id: string, postId: string }, { message: string } | { error: string }> = async (req, res): Promise<void> => {
    try {
        const { id, postId } = req.params;
        const posts: Post[] = await readJSON("posts.json");
        const post = posts.find(post => post.id === postId);

        if(!post) {
            res.status(404).json({ error: "Post with that id does not exist" });
            return;
        }

        let comments: Comment[] = await readJSON("comments.json");

        if (!comments.find((c) => c.id === id)) {
            res.status(404).json({ error: "Comment not found" });
            return;
        }

        comments = comments.filter((c) => c.id !== id);
        writeJSON("comments.json", comments);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting comment" });
    }
};
