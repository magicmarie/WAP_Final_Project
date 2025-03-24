import express from "express";
import { getPosts, createPost, updatePost, deletePost, searchPosts, exportPosts } from "../controllers/postsControllers";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.get("/search", searchPosts);
router.get("/export", exportPosts);

export default router;
