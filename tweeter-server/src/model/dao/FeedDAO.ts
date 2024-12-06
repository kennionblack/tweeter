import { DAO } from "./DAO";
import { FeedInfo } from "../FeedInfo";
import { DataPage } from "../DataPage";

export interface FeedDAO extends DAO<FeedInfo> {
  getPage(
    receiverAlias: string,
    pageSize: number,
    lastFeedInfo: FeedInfo | null
  ): Promise<DataPage<FeedInfo>>;
}
