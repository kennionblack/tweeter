import { AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { Presenter, MessageView } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUser: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private _loginService: LoginService;

  public constructor(view: LogoutView) {
    super(view);
    this._loginService = new LoginService();
    this.logOut = this.logOut.bind(this);
  }

  public get loginService() {
    return this._loginService;
  }

  public set loginService(loginService: LoginService) {
    this._loginService = loginService;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this._loginService.logout(authToken);

      this.view.clearLastInfoMessage();
      this.view.clearUser();
    }, "log user out");
  }
}
