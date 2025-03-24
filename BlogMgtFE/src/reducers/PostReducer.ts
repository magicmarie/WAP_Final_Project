import { Post } from "../types";
import { PostActionTypes } from "../PostActions";

export type PostAction =
  | { type: PostActionTypes.SET_POSTS; payload: Post[] }
  | { type: PostActionTypes.ADD_POST; payload: Post }
  | { type: PostActionTypes.EDIT_POST; payload: { id: string; updatedData: Partial<Post> } }
  | { type: PostActionTypes.DELETE_POST; payload: string }
  | { type: PostActionTypes.SEARCH_POSTS; payload: Post[] }
  | { type: PostActionTypes.SET_EXPORT; payload: Blob }
  | { type: PostActionTypes.SET_LOADING; payload: boolean }
  | { type: PostActionTypes.SET_ERROR; payload: string };

export const postReducer = (state: { posts: Post[]; loading: boolean }, action: PostAction) => {
  switch (action.type) {
    case PostActionTypes.SET_POSTS:
      return { ...state, posts: action.payload as Post[] };
    case PostActionTypes.ADD_POST:
      return { ...state, posts: [action.payload as Post, ...state.posts] };
    case PostActionTypes.EDIT_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? { ...post, ...action.payload.updatedData as Partial<Post> } : post
        ),
      };
    case PostActionTypes.DELETE_POST:
      return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) };
    case PostActionTypes.SEARCH_POSTS:
      return { ...state, posts: action.payload as Post[] };
    case PostActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case PostActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
