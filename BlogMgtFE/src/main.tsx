import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { PostProvider } from "./context/PostsContext.tsx";
import { CommentProvider } from "./context/CommentsContext.tsx";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostProvider>
      <CommentProvider>
        <App />
      </CommentProvider>
    </PostProvider>
  </StrictMode>,
)
