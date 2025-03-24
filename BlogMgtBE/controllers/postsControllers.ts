import { RequestHandler } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import json2md from "json2md";
import archiver from "archiver";
import { rmSync, existsSync, mkdirSync, createWriteStream  } from "node:fs";
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { readJSON, writeJSON } from "../fileHandler";
import { Post } from "../Interfaces";

// Zod creating object Schema for Post Validation
const postSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(5),
    author: z.string(),
    tags: z.array(z.string()),
    bookmarked: z.boolean().default(false),
});

// Fetch all posts with pagination: 15 per page
export const getPosts: RequestHandler<unknown, Post[] | { error: string }, unknown, { page?: string }> = async (req, res): Promise<void> => {
    try {
        // explicitly parses as base 10.
        const page = parseInt(req.query.page || "1", 10);

        if (isNaN(page) || page < 1) {
            res.status(400).json({ error: "Invalid page number" });
            return;
        }

        const posts: Post[] = await readJSON("posts.json");
        const sortedPosts = [...posts].sort((a: Post, b: Post) => {
            // First, sort by bookmarked status (bookmarked posts come first)
            if (a.bookmarked !== b.bookmarked) {
              return b.bookmarked ? 1 : -1; // If `b` is bookmarked, it comes first
            }

            // If both have the same bookmarked status, sort by date (newer posts first)
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });

        res.json(sortedPosts.slice((page - 1) * 15, +page * 15)); // slice(startIndex, endIndex)
    } catch (error) {
        res.status(500).json({error: "Error fetching posts"});
    }
};

// Create a new post
export const createPost: RequestHandler<unknown, Post | { error: string | z.ZodIssue[] }, Omit<Post, 'id' | 'date'>> = async (req, res): Promise<void> => {
    try {
        const validation = postSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ error: validation.error.errors });
            return;
        }

        const posts = await readJSON("posts.json");
        const newPost: Post = { id: uuidv4(), date: new Date().toISOString(), ...req.body };

        posts.unshift(newPost);
        writeJSON("posts.json", posts);

        res.status(201).json(newPost);
    } catch(error) {
        res.status(500).json({error: "Error creating the post"});
    }
};

// Update an existing post
export const updatePost: RequestHandler<{ id: string }, Post | { error: string | z.ZodIssue[] }, Partial<Post>> = async (req, res): Promise<void> => {
    try {
        const { id } = req.params;
        const posts: Post[] = await readJSON("posts.json");
        const index = posts.findIndex((p: any) => p.id === id);

        if (index === -1) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            res.status(400).json({ error: "Request body cannot be empty" });
            return;
        }

        const validation = postSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({ error: validation.error.errors });
            return;
        }

        posts[index] = { ...posts[index], ...req.body };
        writeJSON("posts.json", posts);
        res.json(posts[index]);
    } catch(error) {
        res.status(500).json({error: "Error updating the post"});
    }
};

// Delete a post
export const deletePost: RequestHandler<{ id: string }> = async (req, res) => {
    try{
        const { id } = req.params;
        let posts = await readJSON("posts.json");

        const post: Post | undefined = posts.find((post: Post) => post.id === id);

        if (!post) {
            res.status(404).json({ error: "Post not found" });
            return;
        }

        posts = posts.filter((p: any) => p.id !== id);
        writeJSON("posts.json", posts);
        res.json({ message: "Post deleted successfully" });
    } catch(error) {
        res.status(500).json({error: "Error deleting the post"});
    }
};

// Search posts by title
export const searchPosts: RequestHandler<unknown, Post | {error : string }, unknown, { q?: string }> = async (req, res): Promise<void> => {
    try {
        const { q } = req.query;
        const posts = await readJSON("posts.json");
        if (!q) {
            res.json(posts.slice(0, 15));
            return;
        }

        const results = posts.filter((p: any) =>
            p.title.toLowerCase().includes((q as string).toLowerCase())
        );

        res.json(results);
    } catch(error) {
        res.status(500).json({error: "Error searching for the post"});
    }
};

// Export all posts as Markdown files and download as ZIP
export const exportPosts: RequestHandler = async (req, res): Promise<void> => {
    try {
        const posts = await readJSON("posts.json");

        if (posts.length === 0) {
            res.status(404).json({ error: "No posts available for export" });
            return;
        }

        const exportDir = join(__dirname, "../export");
        if (!existsSync(exportDir)) mkdirSync(exportDir);

        // Generate Markdown files
        await Promise.all(posts.map(async (post: any) => {
            const markdownContent = json2md([
                { h1: post.title },
                { p: `**Author:** ${post.author}` },
                { p: `**Date:** ${new Date(post.date).toLocaleString()}` },
                { p: post.content },
                { p: `**Tags:** ${post.tags.join(", ")}` },
            ]);

            const filePath = join(exportDir, `${post.title.replace(/\s+/g, "_")}.md`);
            await writeFile(filePath, markdownContent);
        }));

        // Create ZIP archive
        const zipPath = join(exportDir, "posts.zip");
        const output = createWriteStream(zipPath); // create a file to stream archive data to.
        const archive = archiver("zip", { zlib: { level: 9 } }); // Sets the compression level.

        archive.pipe(output); // pipe archive data to the f
        archive.directory(exportDir, false); // append files from a sub-directory, putting its contents at the root of archive
        await archive.finalize(); // finalize the archive (ie we are done appending files but streams have to finish yet)

        output.on("close", () => {
            // res.download(filePath, fileName, callback);
            res.download(zipPath, "posts.zip", (err) => {
                if (err) {
                    res.status(500).json({ error: "Error downloading ZIP file" });
                }

                // Clean up temporary files after sending response
                rmSync(exportDir, { recursive: true, force: true });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Error exporting posts" });
    }
};
