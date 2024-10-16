import { User } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { FollowService } from "../model/service/FollowService";

/*export interface UserItemView<T> extends View {
  addItems: (newItems: User[]) => void;
}*/

export abstract class UserItemPresenter<T> extends PagedItemPresenter<
  User,
  FollowService
> {
  protected createService(): FollowService {
    return new FollowService();
  }
}
