import { User } from "tweeter-shared";
import { DAO } from "./DAO";
import { Follow } from "../Follow";
import { DataPage } from "../DataPage";

export interface FollowDAO extends DAO<Follow> {
  readonly followerHandleAttr: string;
  readonly followerNameAttr: string;
  readonly followeeHandleAttr: string;
  readonly followeeNameAttr: string;

  putBatch(followers: Follow[]): Promise<void>;
  getPageOfFollowers(
    followerHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follow>>;
  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follow>>;
  getByAlias(alias: string): Promise<User | null>;
  convertFollowToUser(follow: Follow): User;
}
