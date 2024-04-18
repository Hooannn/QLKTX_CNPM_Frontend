export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
}

export interface IRole {
  id: string;
  role: Role;
}

export interface IUser {
  id: string;
  phone: string;
  address: string;
  date_of_birth: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  first_name: string;
  last_name: string;
  picture?: string;
  account?: Account;
}

export interface Account {
  username: string;
  role: IRole;
  email: string;
}

export interface Credentials {
  access_token: string;
}
