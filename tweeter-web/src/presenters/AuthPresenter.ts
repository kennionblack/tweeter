import { User, AuthToken } from "tweeter-shared";
import { LoginService } from "../model/service/LoginService";
import { Presenter, View } from "./Presenter";

export interface AuthView extends View {
  setImageUrl?: (url: string) => void;
  setImageBytes?: (bytes: Uint8Array) => void;
  setImageFileExtension?: (extension: string) => void;
  updateUser: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
  navigate: (path: string) => void;
}

export abstract class AuthPresenter extends Presenter<AuthView> {
  private service: LoginService;

  public constructor(view: AuthView) {
    super(view);
    this.service = new LoginService();
  }

  public async authenticate(
    alias: string,
    password: string,
    rememberMe: boolean,
    actionString: string,
    originalUrl?: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string
  ) {
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);

      let user = new User("unauthorized", "unauthorized", "unauthorized", "");
      let authToken = new AuthToken("", -1);
      if (actionString === "register") {
        [user, authToken] = await this.service.register(
          firstName!,
          lastName!,
          alias,
          password,
          imageBytes!,
          imageFileExtension!
        );
      } else if (actionString === "login") {
        [user, authToken] = await this.service.login(alias, password);
      } else {
        throw new Error(`Authentication attempted with invalid type ${actionString}`);
      }

      this.view.updateUser(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }

      this.view.setIsLoading(false);
    }, `${actionString} user`);
  }
}
