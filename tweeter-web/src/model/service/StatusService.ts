import { AuthToken, Status } from "tweeter-shared";
import { ServerFacade } from "../../server/ServerFacade";

export class StatusService {
  private serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    const request = {
      token: authToken.token,
      newStatus: newStatus.dto,
    };

    return await this.serverFacade.postStatus(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: authToken.token,
      alias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };

    return await this.serverFacade.loadMoreStoryItems(request);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request = {
      token: authToken.token,
      alias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem == null ? null : lastItem.dto,
    };

    return await this.serverFacade.loadMoreFeedItems(request);
  }
}
