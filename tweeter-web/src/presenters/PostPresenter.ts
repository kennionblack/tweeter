import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface StatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (message: string) => void;
  currentUser: User | null;
  authToken: AuthToken | null;
  post: string;
}

export class PostPresenter extends Presenter<StatusView> {
  private service: StatusService;

  public constructor(view: StatusView) {
    super(view);
    this.service = new StatusService();
  }

  public async submitPost(event: React.MouseEvent) {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(this.view.post, this.view.currentUser!, Date.now());

      await this.service.postStatus(this.view.authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }

  public clearPost(event: React.MouseEvent): void {
    event.preventDefault();
    this.view.setPost("");
  }
}
