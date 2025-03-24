import React, { createContext, useReducer, useContext } from "react";

import { Comment, CommentsContextType } from "../types";
import { CommentActionTypes } from "../PostActions";
import { commentReducer } from "../reducers/commentReducer"
import { fetchComments, createComment, deleteComment } from "../api/comments";

const CommentContext = createContext<CommentsContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, { comments: {}, loading: false, error: null });

  // Fetch comments for a specific post
  const getComments = async (postId: string) => {
    dispatch({ type: CommentActionTypes.SET_LOADING, payload: true });
    try {
      const comments = await fetchComments(postId);
      dispatch({ type: CommentActionTypes.SET_COMMENTS, payload: { postId, comments } });
    } catch (error: any) {
      dispatch({ type: CommentActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: CommentActionTypes.SET_LOADING, payload: false });
    }
  };

  // Add a comment
  const addComment = async (postId: string, newComment: Omit<Comment, "id" | "date" | "postId">) => {
    try {
      const comment = await createComment(postId, newComment);
      dispatch({ type: CommentActionTypes.ADD_COMMENT, payload: { ...comment, postId } });
    } catch (error) {
      dispatch({ type: CommentActionTypes.SET_ERROR, payload: "Failed to add comment" });
    }
  };

  // Remove a comment
  const removeComment = async (postId: string, commentId: string) => {
    try {
      await deleteComment(postId, commentId);
      dispatch({ type: CommentActionTypes.REMOVE_COMMENT, payload: { postId, commentId } });
    } catch (error) {
      dispatch({ type: CommentActionTypes.SET_ERROR, payload: "Failed to delete comment" });
    }
  };

  return (
    <CommentContext.Provider value={{ ...state, getComments, addComment, removeComment }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useCommentContext must be used within a CommentProvider");
  }
  return context;
};
