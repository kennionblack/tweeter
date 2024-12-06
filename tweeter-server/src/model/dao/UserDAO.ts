import { User } from "tweeter-shared";
import { DAO } from "./DAO";
import { UserInfo } from "../UserInfo";

export interface UserDAO extends DAO<UserInfo> {
  getUserByAlias(alias: string): Promise<User>;
  login(alias: string): Promise<UserInfo>;
}
