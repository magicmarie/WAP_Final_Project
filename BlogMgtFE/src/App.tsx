import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PostList, CreatePost, NotFound, EditPostFormPage, PostPage } from './components'
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/post/:postId/edit" element={<EditPostFormPage />} />
        <Route path="/posts/:postId" element={<PostPage />} />
      </Routes>
    </Router>
  );
};

export default App;
