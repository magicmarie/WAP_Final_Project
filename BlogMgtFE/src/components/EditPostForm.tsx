import React, { useState } from "react";

import { usePostContext } from "../context/PostsContext";

const EditPostForm: React.FC<{
  postId: string,
  currentTitle: string,
  currentContent: string,
  currentAuthor: string,
  currentTags: string[],
  currentBookmarked: boolean,
  closeForm: () => void
}> = ({
  postId,
  currentTitle,
  currentContent,
  currentAuthor,
  currentTags,
  currentBookmarked,
  closeForm,
 }) => {
  const { editPost } = usePostContext();
  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
  const [author, setAuthor] = useState(currentAuthor);
  const [tags, setTags] = useState<string[]>(currentTags);
  const [bookmarked, setBookmarked] = useState(currentBookmarked);

  const hasChanges = title !== currentTitle || content !== currentContent || author !== currentAuthor || tags !== currentTags || bookmarked !== currentBookmarked;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editPost(postId, { title, content, author, tags, bookmarked });
    closeForm(); // Close the edit form after saving
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Edit Post</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Title:</label>
        <input
          type="text"
          placeholder="Enter the title"
          className="mt-2 w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content:</label>
        <textarea
          placeholder="Enter the content"
          className="mt-2 w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y h-40 transition"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Author:</label>
        <input
          type="text"
          placeholder="Enter the author"
          className="mt-2 w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags (comma-separated):</label>
        <input
          type="text"
          placeholder="Enter tags"
          className="mt-2 w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={tags}
          onChange={(e) => setTags(e.target.value.split(','))}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={bookmarked}
          onChange={() => setBookmarked(!bookmarked)}
          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          title="Mark as bookmarked"
        />
        <label className="text-sm font-medium text-gray-700">Bookmarked</label>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <button
          type="submit"
          className={`px-6 py-3 text-white font-medium rounded-md ${
            hasChanges ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!hasChanges}
        >
          Save
        </button>
        <button
          type="button"
          className="px-6 py-3 font-medium rounded-md text-gray-700 border border-gray-300 hover:bg-gray-100"
          onClick={closeForm}
        >
          Cancel
        </button>
      </div>
</form>

  );
};

export default EditPostForm;
