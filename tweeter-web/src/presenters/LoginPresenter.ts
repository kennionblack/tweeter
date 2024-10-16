import { AuthPresenter } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter {
  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
    this.authenticate(alias, password, rememberMe, "login", originalUrl);
  }
}
