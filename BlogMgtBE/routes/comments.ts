import express from "express";
import { getComments, addComment, deleteComment } from "../controllers/commentsControllers";

const router = express.Router();

router.get("/:postId/comments", getComments);
router.post("/:postId/comments", addComment);
router.delete("/:postId/comments/:id", deleteComment);

export default router;
