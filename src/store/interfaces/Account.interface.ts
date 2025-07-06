export type LOGINTYPE = "EMAIL_PASSWORD" | "GOOGLE" | "FACEBOOK";
export type ROLE = "ADMIN" | "USER";

export interface Account {
  _id: string;
  localPath: string;
  url: string;
  email: string;
  username: string;
  loginType?: LOGINTYPE;
  role?: ROLE;
}
