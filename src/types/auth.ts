export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
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
  account: {
    username: string;
    role: Role;
    email: string;
  };
}

export interface Credentials {
  access_token: string;
}
