import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Comment } from "../interfaces/Comment.interface";
import { api } from "../../api";
import { toast } from "sonner";


interface CommentState {
  comments: Comment[];
  loading: boolean;
  content: string;
  likedComments: Comment[];
  error: string | null;
}

interface CommentActions {
  likeComment: (commentId: string) => Promise<void>;
  fetchPostComment: (postId: string) => Promise<void>;
  addComment: (postId: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  updateCommnet: (commentId: string) => Promise<void>;
}

export const useCommentStore = create<CommentActions & CommentState>()(
  devtools(
    persist(
      (set, get) => ({
        comments: [],
        content: "",
        loading: false,
        error: null,
        likedComments: [],

        setContent: (content: string) => {
          set({ content: content });
        },

        likeComment: async (commentId: string) => {
          try {
            const response = await api.post(`/like/comment/${commentId}`);
            console.log(`Response of like Comment :${response.status}`);
            toast.success("Comment Liked");
          } catch (error) {
            toast.error("Error in liking comment");
          }
        },
        fetchPostComment: async (postId: string) => {
          try {
            const response = await api.get(`/comments/post/${postId}`);
            console.log(`response of fetchPostComment :${response.status}`);
            set((state) => ({
              ...state,
              comments: response.data.comments,
            }));
            toast.success("Post's Comment fetched Successfull");
          } catch (error) {}
        },
        addComment: async (postId: string) => {
          try {
            const content = get().content;
            const response = await api.post(
              `/comments/post/${postId}`,
              content
            );
const comment:Comment=;
            set((state)=>({
              ...state,
              comments:[...state.comments,comment]
            }))
            toast.success("Comment added ");
            console.log(`reponse of addComment :${response.status}`);
          } catch (error) {
            toast.error("Comment Addition Failed");
          }
        },
        deleteComment: async (commentId: string) => {
          const response = await api.delete(`/comments/${commentId}`);
          console.log(`response of deleteComment :${response.status}`);
          set((state) => ({
            ...state,
            comments: state.comments.filter(
              (comment) => comment._id !== commentId
            ),
          }));
          toast.success("Comment Deleted");
        },
        updateCommnet: async (commentId: string) => {
          try {
            const content = get().content;
            if (content.length <= 0) {
              toast.error("Please enter the comment");
            }
            const response = await api.patch(`/comments/${commentId}`, content);
            console.log(`response of updateCOmment :${response.status}`);
            toast.success("Comment updated");
          } catch (error) {
            toast.error("Failed to update Comment");
          }
        },
      }),
      {
        name: "comment-store",
        partialize: (state) => {
          comments: state.comments;
          loading: state.loading;
        },
      }
    )
  )
);
