import { User } from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { FollowService } from "../model/service/FollowService";
import { View } from "./Presenter";

export interface UserItemView extends View {
  addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends PagedItemPresenter<User, FollowService> {
  protected createService(): FollowService {
    return new FollowService();
  }
}
