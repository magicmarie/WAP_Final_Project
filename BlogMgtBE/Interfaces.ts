export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  date: string;
  bookmarked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
}
