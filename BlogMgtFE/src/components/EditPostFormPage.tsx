import { useParams } from "react-router-dom";

import { usePostContext } from "../context/PostsContext";
import EditPostForm from "./EditPostForm";

const EditPostFormPage: React.FC = () => {
  const { postId } = useParams();
  const { posts } = usePostContext();

  const post = posts.find((p) => p.id === postId);

  if (!post) return <p>Post not found.</p>;

  return (
    <EditPostForm
      postId={post.id}
      currentTitle={post.title}
      currentContent={post.content}
      currentAuthor={post.author}
      currentTags={post.tags}
      currentBookmarked={post.bookmarked}
      closeForm={() => history.back()} // Navigates back after saving
    />
  );
};

export default EditPostFormPage;
