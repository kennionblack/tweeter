import { AuthToken, Status } from "tweeter-shared";

export interface StatusItemView {
  displayErrorMessage: (message: string) => void;
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter {
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;
  private _view: StatusItemView;

  protected constructor(view: StatusItemView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public abstract loadMore(authToken: AuthToken, userAlias: string): void;
}
