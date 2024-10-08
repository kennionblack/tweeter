import { AuthToken, User } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export class LoginPresenter {
  private loginService: LoginService;
  private view: LoginView;

  public constructor(view: LoginView) {
    //super(view);
    this.loginService = new LoginService();
    this.view = view;
  }

  public async doLogin(
    updateUser: (
      currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean
    ) => void,
    alias: string,
    password: string,
    rememberMe: boolean
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.loginService.login(alias, password);

      updateUser(user, user, authToken, rememberMe);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
