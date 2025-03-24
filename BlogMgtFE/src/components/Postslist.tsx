import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

import { usePostContext } from "../context/PostsContext";

const visitedPostsAtom = atomWithStorage<string[]>('visitedPosts', []);

const PostList: React.FC = () => {
  const { posts, fetchPosts, search, exportPosts } = usePostContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [visitedPosts, setVisitedPosts] = useAtom(visitedPostsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim()) {
      search(searchQuery);
    } else {
      fetchPosts();
    }
  }, [searchQuery, fetchPosts]);

  const handleDownload = (blobData: Blob) => {
    const url = window.URL.createObjectURL(blobData); // generates a temporary URL that points to the Blob data.
    const link = document.createElement("a"); // create invisible anchor tag

    link.href = url;
    link.download = "posts.zip";
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      const data = await exportPosts();
      handleDownload(data);
    } catch (error) {
      console.error("Error exporting posts:", error);
    }
  }

  // Get unique authors and tags for filters
  const uniqueTags = [...new Set(posts.flatMap((post) => post.tags))];
  const uniqueAuthors = [...new Set(posts.map((post) => post.author))];

  // Filter posts based on the selected filter (can be a tag or author)
  const filteredPosts = posts.filter((post) => {
    return (
      selectedFilter === "" ||
      post.tags.includes(selectedFilter) ||
      post.author === selectedFilter
    );
  });

  // Mark post as visited
  const handlePostClick = (postId: string) => {
    if (!visitedPosts.includes(postId)) {
      setVisitedPosts((prev) => [...prev, postId]);
    }
  };

  const clearVisitsHistory = () => {
    setVisitedPosts([]);
  };

  return (
    <div className="container mx-auto p-4">
      <nav className="bg-gray-800 text-white p-4 mb-4 rounded-lg shadow-lg">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <h1 className="text-2xl font-bold">BMP</h1>

          {/* Buttons Container */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={() => navigate("/create")}
            >
              Create Post
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={handleExport}
            >
              Export Posts
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
              onClick={clearVisitsHistory}
            >
              Clear History
            </button>
          </div>
        </div>
      </nav>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              id="search"
              placeholder="🔍 Search posts by title"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative w-full sm:w-1/2">
            <select
              id="filter"
              className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              title="Filter by Tag or Author"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="">Filter by Tag or Author</option>
              <optgroup label="Tags">
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Authors">
                {uniqueAuthors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-600 mt-4 text-center">No posts to show...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredPosts.map((post) => (
              <a
                key={post.id}
                href={`/posts/${post.id}`}
                className={`border p-4 rounded-lg shadow-md transition-all duration-200 block ${
                  visitedPosts.includes(post.id) ? "bg-gray-300" : "bg-white"
                } hover:bg-gray-100`}
                onClick={() => handlePostClick(post.id)}
              >
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-gray-600 mt-1">By {post.author}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostList;
