import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect
} from "react";

import { postReducer } from "../reducers/PostReducer"
import { Post, PostContextType } from "../types";
import { PostActionTypes } from "../PostActions";
import { searchPosts, updatePost, deletePost, getPosts, createPost, exportAll } from "../api/posts";

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePostContext must be used within a PostProvider");
  return context;
};

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, { posts: [], loading: false });

  // Fetch Posts
  const fetchPosts = useCallback(async () => {
    dispatch({ type: PostActionTypes.SET_LOADING, payload: true });
    try {
      const data = await getPosts();

      dispatch({ type: PostActionTypes.SET_POSTS, payload: data });
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      dispatch({ type: PostActionTypes.SET_LOADING, payload: false });
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Add Post
  const addPost = async (newPost: Omit<Post, "id" | "date">) => {
    try {
      const createdPost = await createPost(newPost);
      dispatch({ type: PostActionTypes.ADD_POST, payload: createdPost });
    }catch (error) {
      console.error("Error adding post:", error);
    }
  };

  // Edit Post
  const editPost = async (postId: string, updatedData: Omit<Post, "id" | "date">) => {
    try {
      const updatedPost = await updatePost(postId, updatedData);
      dispatch({ type: PostActionTypes.EDIT_POST, payload: { id: postId, updatedData: updatedPost } });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  // Delete Post
  const removePost = async (postId: string) => {
    try {
      await deletePost(postId);
      dispatch({ type: PostActionTypes.DELETE_POST, payload: postId });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Search Posts
  const search = useCallback(async (query: string) => {
    dispatch({ type: PostActionTypes.SET_LOADING, payload: true });
    try {
      const result = await searchPosts(query);
      dispatch({ type: PostActionTypes.SEARCH_POSTS, payload: result });
    } catch (error: any) {
      dispatch({ type: PostActionTypes.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: PostActionTypes.SET_LOADING, payload: false });
    }
  }, [dispatch]);

  // export all posts
  const exportPosts = async (): Promise<Blob> => {
    dispatch({ type: PostActionTypes.SET_LOADING, payload: true });
    try {
      const data: Blob = await exportAll();

      dispatch({ type: PostActionTypes.SET_EXPORT, payload: data });
      return data;
    } catch (error) {
      console.error("Error exporting posts:", error);
      throw error;
    } finally {
      dispatch({ type: PostActionTypes.SET_LOADING, payload: false });
    }
  }

  return (
    <PostContext.Provider value={{ ...state, fetchPosts, addPost, editPost, removePost, search, exportPosts }}>
      {children}
    </PostContext.Provider>
  );
};

