import type { Account } from "./Account.interface";
import type { CoverImage } from "./CoverImage.interface";

export interface Profile {
  _id: string;
  account: Account;
  bio: string;
  countryCode: string;
  coverImage: CoverImage;
  createdAt: Date;
  dob: Date;
  firstName: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  lastName: string;
  owner: string;
  location: string;
  phoneNumber: string;
  updatedAt: Date;
}

export interface ProfileParams {
 bio:string;
 countryCode:string;
 dob:Date;
 firstName:string;
 lastName:string;
 location:string;
 phoneNumber:string;
}
