import { AuthToken, User } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";

export interface LoginView {
  updateUser: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  displayErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
}

export class LoginPresenter {
  private loginService: LoginService;
  private view: LoginView;

  public constructor(view: LoginView) {
    this.loginService = new LoginService();
    this.view = view;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.loginService.login(alias, password);

      this.view.updateUser(user, user, authToken, rememberMe);
      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
