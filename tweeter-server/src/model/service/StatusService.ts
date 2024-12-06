import { Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { FeedInfo } from "../FeedInfo";

export class StatusService extends Service {
  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.authorize(token);
    await this.storyDAO.put(Status.fromDto(newStatus)!);
    await this.feedDAO.put(
      new FeedInfo(newStatus.user.alias, newStatus.user.alias, newStatus.timestamp, newStatus.post)
    );
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authorize(token);
    const dataPage = await this.storyDAO.getPage(userAlias, pageSize, Status.fromDto(lastItem));
    const hasMore = dataPage.hasMorePages;
    const dtos = dataPage.values.map((status) => status.dto);
    return [dtos, hasMore];
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.authorize(token);
    const feedInfo = lastItem
      ? new FeedInfo(lastItem.user.alias, lastItem.user.alias, lastItem.timestamp, lastItem.post)
      : null;
    const dataPage = await this.feedDAO.getPage(userAlias, pageSize, feedInfo);
    const hasMore = dataPage.hasMorePages;
    const dtos = await Promise.all(
      dataPage.values.map(async (feedInfo) => {
        return (await this.convertFeedInfoToStatus(feedInfo)).dto;
      })
    );

    return [dtos, hasMore];
  }

  private async convertFeedInfoToStatus(feedInfo: FeedInfo): Promise<Status> {
    const user = await this.userDAO.getUserByAlias(feedInfo.followerAlias);
    return new Status(feedInfo.post, user, feedInfo.timestamp);
  }
}
