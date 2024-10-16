import { AuthToken, User } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { Presenter, View } from "./Presenter";

export interface LoginView<T> extends View {
  updateUser: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
}

export class LoginPresenter<T> extends Presenter<LoginView<T>> {
  private loginService: LoginService;

  public constructor(view: LoginView<T>) {
    super(view);
    this.loginService = new LoginService();
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.loginService.login(alias, password);

      this.view.updateUser(user, user, authToken, rememberMe);
      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user in");
    this.view.setIsLoading(false);
  }
}
