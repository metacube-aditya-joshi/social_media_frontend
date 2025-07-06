import type { Post, Posts } from "../interfaces/Post.interface";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { toast } from "sonner";
import { api } from "@/api";

interface PostState {
  posts: Post[];
  currentPost: Post | null;
  postData: Posts | null;
  loading: boolean;
  error: string | null;
}
interface PostActions {
  fetchAllPosts: (page: number, limit: string) => Promise<void>;
  createPost: (
    content: string,
    images: string[],
    tags: string[]
  ) => Promise<void>;
  fetchPostById: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  updatePost: (
    postId: string,
    content: string,
    images: string[],
    tags: string[]
  ) => Promise<void>;
  fetchPostByUsername: (
    userName: string,
    page: number,
    limit: string
  ) => Promise<void>;
  fetchPostByTag: (tag: string, page: number, limit: string) => Promise<void>;
  removePostImage: (postId: string, imageId: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
}

export const usePostStore = create<PostState & PostActions>()(
  devtools(
    persist(
      (set) => ({
        posts: [],
        currentPost: null,
        postData: null,
        loading: false,
        error: null,

        fetchAllPosts: async (page: number, limit: string) => {
          try {
            const response = await api.get("/posts");
            console.log(`response of fetchAllPosts :${response.status}`, {
              page,
              limit,
            });

            set((state) => ({
              ...state,
              posts: response.data.posts,
            }));
            toast.success("Posts fetched");
          } catch (error) {
            toast.error("Failed to fetch post");
          }
        },
        createPost: async (
          content: string,
          images: string[],
          tags: string[]
        ) => {
          try {
            if (!(content && images && tags)) {
              toast.warning("Enter the necessary feilds data");
              return;
            }
            const response = await api.post(`/posts`, {
              content,
              images,
              tags,
            });
            console.log(`reponse of createPost :${response.status}`);
            set((state) => ({
              ...state,
              posts: [...state.posts, response.data.post],
            }));
            toast.success("Post created");
          } catch (error) {
            toast.error("Failed to create post");
          }
        },
        fetchPostById: async (postId: string) => {
          try {
            const response = await api.get(`/posts/${postId}`);
            console.log(`reponse of fetchPostById :${response.status}`);
            toast.success("Post fetched");
          } catch (error) {
            toast.error("Failed to fetch post");
          }
        },
        deletePost: async (postId: string) => {
          try {
            const response = await api.delete(`/posts/${postId}`);
            console.log(`reponse of deletePost :${response.status}`);
            set((state) => ({
              ...state,
              posts: state.posts.filter((post) => post._id !== postId),
            }));
            toast.success("Post deleted");
          } catch (error) {
            toast.error("Post deletion failed");
          }
        },
        updatePost: async (
          postId: string,
          content: string,
          images: string[],
          tags: string[]
        ) => {
          try {
            const response = await api.patch(`/posts/${postId}`, {
              images,
              content,
              tags,
            });
            console.log(`reponse of updatePost :${response.status}`);
            toast.success("Post updated");
          } catch (error) {
            toast.error("Failed to update post");
          }
        },
        fetchPostByUsername: async (
          userName: string,
          page: number,
          limit: string
        ) => {
          try {
            const response = await api.get(`/posts/get/u/${userName}`, {
              params: { page, limit },
            });
            console.log(`response of FetchPostByUsername :${response.status}`);
            toast.success("Post fetched");
          } catch (error) {
            toast.error("Failed to fetch post");
          }
        },
        fetchPostByTag: async (tag: string, page: number, limit: string) => {
          try {
            const response = await api.get(`/posts/get/t/${tag}`, {
              params: { page, limit },
            });
            console.log(`response of FetchPostByTag :${response.status}`);
            toast.success("Post fetched");
          } catch (error) {
            toast.error("Failed to fetch post");
          }
        },
        removePostImage: async (postId: string, imageId: string) => {
          try {
            const respone = await api.patch(
              `/posts/remove/image/${postId}/${imageId}`
            );
            console.log(`response of removePostImage: ${respone.status}`);
            toast.success("Image removed");
          } catch (error) {
            toast.error("Failed to remove post image");
          }
        },
        likePost: async (postId: string) => {
          try {
            const response = await api.post(`/like/post/${postId}`);
            console.log(`reponse of likePost :${response.status}`);
            if (response.data.isLiked) toast.success("Post Liked");
            else toast.success("Post Unliked");
          } catch (error) {
            toast.error("Failed to like or unlike post");
          }
        },
      }),
      {
        name: "post-store",
        partialize: (state) => {
          posts: state.posts;
          currentPost: state.currentPost;
          loading: state.loading;
          postData: state.postData;
        },
      }
    )
  )
);
