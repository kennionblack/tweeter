import { Status } from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../model/service/StatusService";
import { View } from "./Presenter";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends PagedItemPresenter<Status, StatusService> {
  protected createService(): StatusService {
    return new StatusService();
  }
}
