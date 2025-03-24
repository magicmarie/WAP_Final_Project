import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Post } from "../types";
import { usePostContext } from "../context/PostsContext";
import { useCommentContext } from "../context/CommentsContext";

const PostItem: React.FC<{post: Post}> = ({ post }) => {
  const { removePost } = usePostContext();
  const { getComments, comments, removeComment, addComment } = useCommentContext();

  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      getComments(post.id);
  }, [post.id]);

  const handleDeletePost = (id: string) => {
    removePost(id);
    navigate("/"); // Redirect to homepage after deletion
  };

  const postComments = comments[post?.id] || [];

  const handleDeleteComment = async (commentId: string) => {
      await removeComment(post.id, commentId);
  };

  const handleAddComment = async (e: React.FormEvent) => {
      e.preventDefault();
      await addComment(post.id, {
        author: commentAuthor,
        content: commentContent,
      });

    setCommentContent("");
    setCommentAuthor("");
    setIsEditingComment(false);
  }

  const handleCancelComment = () => {
    setCommentContent("");
    setCommentAuthor("");
    setIsEditingComment(false);
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg relative">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          onClick={() => navigate("/")}
        >
          ← Back to Posts
        </button>
        <div className="flex gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => navigate(`/post/${post.id}/edit`)}
          >
            {"\u270F\uFE0F"}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg hover:bg-red-700 transition"
            onClick={() => handleDeletePost(post.id)}
          >
            {"\uD83D\uDDD1️"}
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2">{post?.title}</h1>
      <p className="text-gray-600 text-lg">
        <b>By:</b> {post?.author}
      </p>
      <p className="text-gray-500 text-md mb-4">
        <b>Tags:</b> {post?.tags?.join(", ")}
      </p>
      <p className="text-gray-500 mb-4">
        <b>{post?.bookmarked ? "Bookmarked \u2705" : "Not Bookmarked \u274C"}</b>
      </p>
      <p className="text-gray-700 text-lg mb-6 leading-relaxed">{post?.content}</p>

      <div className="mt-6 p-4 border rounded-lg bg-gray-100">
        <h3 className="font-semibold text-lg mb-3 flex justify-between items-center">
          Comments
          <button
            type="button"
            className="text-green-500 font-bold text-2xl hover:text-green-600"
            onClick={() => setIsEditingComment(true)}
          >
            {"\u2795"}
          </button>
        </h3>

        {isEditingComment && (
          <form onSubmit={handleAddComment} className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
            <input
              type="text"
              placeholder="Your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              required
            />
            <textarea
              placeholder="Your comment"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            />
            <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Add
            </button>
              <button
                type="button"
                className="text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                onClick={handleCancelComment}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {postComments.length > 0 ? (
          <div className="space-y-3">
            {postComments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 bg-white rounded-lg shadow-sm border flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{comment.author}</p>
                  <p className="text-gray-600 italic">{comment.content}</p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  {"\u274C"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostItem;
