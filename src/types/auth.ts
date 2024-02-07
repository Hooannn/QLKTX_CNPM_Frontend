export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  STUDENT = "STUDENT",
}

export interface IUser {
  id: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  sex: "MALE" | "FEMALE" | "OTHER";
  first_name: string;
  last_name: string;
  picture?: string;
  role: Role;
}

export interface Credentials {
  access_token: string;
}
