import { CommentActionTypes } from "../PostActions";
import { Comment } from "../types";

// Define State
interface CommentState {
  comments: Record<string, Comment[]>;
  loading: boolean;
  error: string | null;
}

// Define Actions
type CommentAction =
  | { type: CommentActionTypes.SET_COMMENTS; payload: { postId: string; comments: Comment[] } }
  | { type: CommentActionTypes.ADD_COMMENT; payload: Comment }
  | { type: CommentActionTypes.REMOVE_COMMENT; payload: { postId: string; commentId: string } }
  | { type: CommentActionTypes.SET_LOADING; payload: boolean }
  | { type: CommentActionTypes.SET_ERROR; payload: string | null };

export const commentReducer = (state: CommentState, action: CommentAction): CommentState => {
  switch (action.type) {
    case CommentActionTypes.SET_COMMENTS:
      return { ...state,
        comments: {...state.comments, [action.payload.postId]: action.payload.comments},
        error: null
      };
    case CommentActionTypes.ADD_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: [
            ...(state.comments[action.payload.postId] || []),
            action.payload,
          ],
        },
        error: null,
      };
    case CommentActionTypes.REMOVE_COMMENT:
      return {
        ...state,
        comments: {
          ...state.comments,
          [action.payload.postId]: state.comments[action.payload.postId]?.filter(
            (comment) => comment.id !== action.payload.commentId
          ) || [],
        },
      };
    case CommentActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case CommentActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
