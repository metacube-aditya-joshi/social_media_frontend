import type { Account } from "../interfaces/Account.interface";
import type { Post } from "../interfaces/Post.interface";
import type { Profile, ProfileParams } from "../interfaces/Profile.interface";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { api } from "../../api";
import axios from "axios";
interface UserState {
  account: Account | null;
  profile: Profile | null;
  currentUser: Account | null;
  isAuthenticated: boolean;
  userName: string | null;
  bookmarkedPosts: Post[];
  profileParams: ProfileParams | null;
  followers: Profile[];
  following: Profile[];
  posts: Post[];
}

interface UserActions {
  fetchProfile: () => Promise<void>;
  updateProfile: () => Promise<void>;
  fetchProfileByUsername: () => Promise<Profile | null>;
  updateCoverImage: (coverImageUrl: string) => Promise<void>;
  fetchUserFollowers: () => Promise<void>;
  fetchUserFollowing: () => Promise<void>;
  followUser: (toBeFollowedUserId: string) => Promise<void>;
  fetchBookMarkedPost: () => Promise<void>;
  bookmarkPost: () => Promise<void>;
  fetchMyPosts: () => Promise<void>;
  setCurrentUser: (user: Account) => void;
  setProfileParams: (profileParams: ProfileParams) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setUserName: (userName: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState & UserActions>()(
  devtools(
    persist(
      (set, get) => ({
        followers: [],
        posts: [],
        following: [],
        profileParams: null,
        currentUser: null,
        userName: null,
        account: null,
        profile: null,
        isAuthenticated: false,
        bookmarkedPosts: [],

        logout: () => {
          set({
            followers: [],
            posts: [],
            following: [],
            profileParams: null,
            currentUser: null,
            userName: null,
            account: null,
            profile: null,
            isAuthenticated: false,
            bookmarkedPosts: [],
          });
        },
        setCurrentUser: (user: Account) => {
          set({ currentUser: user });
        },
        setProfileParams: (profileParams: ProfileParams) => {
          set({ profileParams: profileParams });
        },
        setAuthenticated: (isAuthenticated: boolean) => {
          set({ isAuthenticated: isAuthenticated });
        },
        setUserName: (userName: string) => {
          set({ userName: userName });
        },

        fetchProfile: async () => {
          try {
            const response = await api.get("/profile");
            console.log(`response of fetchProfile :${response.status}`);
            set((state) => ({
              ...state,
              profile: response.data,
            }));
          } catch (error) {
            console.error("Error fetching profile: ", error);
            throw error;
          }
        },
        updateProfile: async () => {
          const profileParams = get().profileParams;
          const response = await api.patch("/profile", profileParams);
          console.log(`response of updateProfile :${response.status}`);
          set((state) => ({
            ...state,
            profile: response.data,
          }));
        },
        fetchProfileByUsername: async () => {
          try {
            const userName = get().userName;
            if (!userName) {
              console.error("Error fetching profile by username:");
              return;
            }
            const response = await api.get(`/profile/u/${userName}`);
            console.log(
              `reponse of fetchProfileByUsername :${response.status}`
            );
            return response.data;
          } catch (error) {
            console.error("Error fetching profile by username:", error);
            throw error;
          }
        },
        //add toast to give the toast of error and success
        updateCoverImage: async (coverImageUrl: string) => {
          try {
            if (coverImageUrl.length > 0) {
              const response = await api.patch(
                "/profile/cover-image",
                coverImageUrl
              );
              console.log(`response of updateCoverImage :${response.data}`);
              set((state) => ({
                ...state,
                profile: response.data,
              }));
            } else {
            }
          } catch (error) {}
        },
        fetchUserFollowers: async () => {
          try {
            const userName = get().userName;
            const response = await api.get(
              `/follow/list/followers/${userName}`
            );
            set((state) => ({
              ...state,
              followers: response.data,
            }));
            console.log(`response of fetchUserFollowers :${response.status}`);
          } catch (error) {}
        },
        fetchUserFollowing: async () => {
          try {
            const userName = get().userName;
            const response = await api.get(
              `/follow/list/followering/${userName}`
            );
            set((state) => ({
              ...state,
              followers: response.data.following,
            }));
            console.log(`response of fetchUserFollowering :${response.status}`);
          } catch (error) {}
        },
        followUser: async (toBeFollowedUserId: string) => {
          const response = await api.post(`/follow/${toBeFollowedUserId}`);
          console.log(`respone of followUser :${response.data}`);
          // set((state) => ({
          //   ...state,
          //   following: response.data.following
          //     ? [...state.following, toBeFollowedUserId]
          //     : state.following.filter(
          //         (follow) => follow !== toBeFollowedUserId
          //       ),
          // }));
        },
        fetchBookMarkedPost: async () => {
          const response = await api.get("/bookmarks");
          console.log(`response of fetchBookMarkedPost :${response.status}`);
          set((state) => ({
            ...state,
            bookmarkedPosts: response.data.bookmarkedPosts,
          }));
        },
        bookmarkPost: async () => {},
        fetchMyPosts: async () => {
          const userName = get().userName;
          const respone = await axios.get(`/posts/get/u/${userName}`);
          console.log(`response of fetchMyPosts :${respone.status}`);
          set((state) => ({
            ...state,
            posts: respone.data.posts,
          }));
        },
      }),
      {
        name: "user-state",
        partialize: (state) => ({
          account: state.account,
          profile: state.profile,
          isAuthenticated: state.isAuthenticated,
          bookmarkedPosts: state.bookmarkedPosts,
        }),
      }
    )
  )
);
