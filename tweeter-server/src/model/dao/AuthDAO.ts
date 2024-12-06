import { AuthToken } from "tweeter-shared";
import { DAO } from "./DAO";

export interface AuthDAO extends DAO<AuthToken> {
  isAuthorized(token: string): Promise<boolean>;
}
