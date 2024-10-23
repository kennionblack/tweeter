import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface StatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (message: string) => void;
}

export class PostPresenter extends Presenter<StatusView> {
  private _statusService: StatusService;

  public constructor(view: StatusView) {
    super(view);
    this._statusService = new StatusService();
  }

  public get statusService() {
    return this._statusService;
  }

  public set statusService(statusService: StatusService) {
    this._statusService = statusService;
  }

  public async submitPost(
    event: React.MouseEvent,
    currentUser: User | null,
    authToken: AuthToken | null,
    post: string
  ) {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this._statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);

      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }, "post the status");
  }

  public clearPost(event: React.MouseEvent): void {
    event.preventDefault();
    this.view.setPost("");
  }
}
