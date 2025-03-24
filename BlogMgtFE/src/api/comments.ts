import { Comment } from "../types";

const API_BASE_URL = "http://localhost:3000/posts";

// Fetch all comments for a specific post
export const fetchComments = async (postId: string) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments`);
  const data = await response.json()

  if (!response.ok) throw new Error("Failed to fetch comments");
  return data;
};

// Add a new comment to a post
export const createComment = async (postId: string, newComment: Omit<Comment, "id" | "date" | "postId">) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment),
  });

  if (!response.ok) throw new Error("Failed to create comment");
  return response.json();
};

// Delete a comment from a post
export const deleteComment = async (postId: string, commentId: string) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments/${commentId}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error("Failed to delete comment");
  return response.json();
};
