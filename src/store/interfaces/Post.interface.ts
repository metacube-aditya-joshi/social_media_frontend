import type { CoverImage } from "./CoverImage.interface";
import type { Profile } from "./Profile.interface";

export interface Post {
  _id: string;
  author: Profile;
  comment: number;
  content: string;
  createdAt: Date;
  images: CoverImage[];
  isBookMarked: boolean;
  isLike: boolean;
  like: number;
  tags: string[];
  updatedAt: Date;
}

export interface Posts {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: number;
  page: number;
  posts: Post[];
}
