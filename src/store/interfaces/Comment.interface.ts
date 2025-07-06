import type { Profile } from "./Profile.interface";

export interface Comment {
  _id: string;
  author: Profile;
  content: string;
  createdAt: Date;
  isLikes: boolean;
  likes: number;
  postId: string;
  updatedAt: Date;
}
