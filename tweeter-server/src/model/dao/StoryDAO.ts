import { Status } from "tweeter-shared";
import { DAO } from "./DAO";
import { DataPage } from "../DataPage";

export interface StoryDAO extends DAO<Status> {
  getPage(alias: string, pageSize: number, lastStatus: Status | null): Promise<DataPage<Status>>;
}
