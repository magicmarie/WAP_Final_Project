export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  date: string;
  bookmarked: boolean;
}

export interface PostContextType {
  posts: Post[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
  addPost: (newPost: Omit<Post, "id" | "date">) => Promise<void>;
  search: (query: string) => Promise<void>;
  editPost: (postId: string, updatedData: Omit<Post, "id" | "date">) => Promise<void>;
  removePost: (postId: string) => Promise<void>;
  exportPosts: () => Promise<Blob>;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
}
export interface CommentsContextType {
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
  getComments: (postId: string) => Promise<void>;
  addComment: (postId: string, comment: Omit<Comment, "id" | "date" | "postId">) => Promise<void>;
  removeComment: (postId: string, commentId: string) => Promise<void>;
}
