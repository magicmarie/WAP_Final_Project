import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { usePostContext } from '../context/PostsContext';

const CreatePostForm: React.FC = () => {
  const { addPost } = usePostContext();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPost = { title, content, author, tags, bookmarked };

    try {
      await addPost(newPost);

      setTitle("");
      setContent("");
      setAuthor("");
      setTags([]);
      setBookmarked(false);

      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Create Post</h2>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Title:</label>
        <input
          type="text"
          placeholder="Enter the title"
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Content:</label>
        <textarea
          placeholder="Enter the content"
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Author:</label>
        <input
          type="text"
          placeholder="Enter the author"
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Tags (comma separated):</label>
        <input
          type="text"
          placeholder="Enter tags separated by commas"
          className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tags}
          onChange={(e) => setTags(e.target.value.split(','))}
          required
        />
      </div>

    <div className="flex items-center space-x-2">
      <input
        title="Bookmarked"
        type="checkbox"
        checked={bookmarked}
        onChange={() => setBookmarked(!bookmarked)}
        className="h-4 w-4 text-green-500 border-gray-300 rounded"
      />
      <label className="text-sm font-medium text-gray-700">Bookmarked</label>
    </div>

    <div className="flex justify-between gap-4">
      <button
        type="button"
        className="w-full sm:w-auto text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        onClick={() => history.back()}
      >
        Cancel
      </button>

      <button
        type="submit"
        className={`w-full sm:w-auto text-white px-6 py-3 rounded-lg shadow-md ${
          !title.trim() || !author.trim() || !content.trim() || tags.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600 focus:outline-none"
        }`}
        disabled={!title.trim() || !author.trim() || !content.trim() || tags.length === 0}
      >
        Create Post
      </button>
    </div>
  </form>
  );
};

export default CreatePostForm;
