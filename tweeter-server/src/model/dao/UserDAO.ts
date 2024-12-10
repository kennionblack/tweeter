import { DAO } from "./DAO";
import { UserInfo } from "../UserInfo";

export interface UserDAO extends DAO<UserInfo> {
  getUserByAlias(alias: string): Promise<UserInfo>;
  login(alias: string): Promise<UserInfo>;
}
