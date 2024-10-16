import { AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { Presenter, MessageView } from "./Presenter";

export interface LogoutView<T> extends MessageView {
  clearUser: () => void;
  authToken: AuthToken | null;
}

export class LogoutPresenter<T> extends Presenter<LogoutView<T>> {
  private service: LoginService;

  public constructor(view: LogoutView<T>) {
    super(view);
    this.service = new LoginService();
    this.logOut = this.logOut.bind(this);
  }
  public async logOut() {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.service.logout(this.view.authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUser();
    }, "log user out");
  }
}
