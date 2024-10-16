import { Status } from "tweeter-shared";
import { PagedItemPresenter } from "./PagedItemPresenter";
import { StatusService } from "../model/service/StatusService";

/*export interface StatusItemView<T> extends View {
  addItems: (newItems: Status[]) => void;
}*/

export abstract class StatusItemPresenter<T> extends PagedItemPresenter<
  Status,
  StatusService
> {
  protected createService(): StatusService {
    return new StatusService();
  }
}
