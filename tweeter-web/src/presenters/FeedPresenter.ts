import { AuthToken } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { PAGE_SIZE } from "./FolloweePresenter";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  private service: StatusService;

  public constructor(view: StatusItemView) {
    super(view);
    this.service = new StatusService();
  }

  public async loadMore(authToken: AuthToken, userAlias: string) {
    try {
      const [newItems, hasMore] = await this.service.loadMoreFeedItems(
        authToken!,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load feed items because of exception: ${error}`
      );
    }
  }
}
