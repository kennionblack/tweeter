import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavView<T> extends View {
  setDisplayedUser: (user: User) => void;
  currentUser: User | null;
  authToken: AuthToken | null;
}
export class UserNavPresenter<T> extends Presenter<UserNavView<T>> {
  private service: UserService;

  public constructor(view: UserNavView<T>) {
    super(view);
    this.service = new UserService();
    this.navigateToUser = this.navigateToUser.bind(this);
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    this.doFailureReportingOperation(async () => {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.service.getUser(this.view.authToken!, alias);

      if (!!user) {
        if (this.view.currentUser!.equals(user)) {
          this.view.setDisplayedUser(this.view.currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }

  public extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
