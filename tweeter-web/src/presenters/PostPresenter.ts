import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";

export interface StatusView {
  displayErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  clearLastInfoMessage: () => void;
  setPost: (message: string) => void;
  currentUser: User | null;
  authToken: AuthToken | null;
  post: string;
}

export class PostPresenter {
  private service: StatusService;
  private view: StatusView;

  public constructor(view: StatusView) {
    this.view = view;
    this.service = new StatusService();
  }

  public async submitPost(event: React.MouseEvent) {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(
        this.view.post,
        this.view.currentUser!,
        Date.now()
      );

      await this.service.postStatus(this.view.authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }

  public clearPost(event: React.MouseEvent): void {
    event.preventDefault();
    this.view.setPost("");
  }
}
