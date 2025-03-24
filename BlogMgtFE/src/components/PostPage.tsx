import { useParams } from "react-router-dom";

import { usePostContext } from "../context/PostsContext";
import PostItem from "./Post";

const PostPage: React.FC = () => {
  const { postId } = useParams();
  const { posts } = usePostContext();

  const post = posts.find((p) => p.id === postId);

  if (!post) return <p>Post not found.</p>;

  return <PostItem post={post} />;
};

export default PostPage;
