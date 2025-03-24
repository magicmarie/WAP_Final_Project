import { Post } from "../types";

const API_BASE_URL = "http://localhost:3000/posts";

// Fetch all posts
export const getPosts = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

// Search for posts by title or content
export const searchPosts = async (query: string) => {
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) throw new Error("Failed to search posts");
  return response.json();
};

// Create a new post
export const createPost = async (postData: Omit<Post, "id" | "date">) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });

  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

// Update a post
export const updatePost = async (postId: string, updatedData: Omit<Post, "id" | "date">) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Failed to update post");
  return response.json();
};

// Delete a post
export const deletePost = async (postId: string) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete post");
};

export const exportAll = async () => {
  const response = await fetch(`${API_BASE_URL}/export`);
  if (!response.ok) throw new Error("Failed to export posts");

  const blob = await response.blob(); // converts the ZIP file response from the BE into a Blob (Binary Large Object).
  return blob;
}
