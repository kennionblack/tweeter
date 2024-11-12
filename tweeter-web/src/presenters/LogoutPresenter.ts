import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUser: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _userService: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this._userService = new UserService();
    this.logOut = this.logOut.bind(this);
  }

  public get userService() {
    return this._userService;
  }

  public set userService(userService: UserService) {
    this._userService = userService;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this._userService.logout(authToken);

      this.view.clearLastInfoMessage();
      this.view.clearUser();
    }, "log user out");
  }
}
