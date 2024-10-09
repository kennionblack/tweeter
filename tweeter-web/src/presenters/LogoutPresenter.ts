import { AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";

export interface LogoutView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  clearLastInfoMessage: () => void;
  clearUser: () => void;
  authToken: AuthToken | null;
}

export class LogoutPresenter {
  private service: LoginService;
  private view: LogoutView;

  public constructor(view: LogoutView) {
    this.view = view;
    this.service = new LoginService();
    this.logOut = this.logOut.bind(this);
  }
  public async logOut() {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(this.view.authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUser();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
