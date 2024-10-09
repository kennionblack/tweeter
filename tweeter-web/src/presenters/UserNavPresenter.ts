import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavView {
  displayErrorMessage: (message: string) => void;
  setDisplayedUser: (user: User) => void;
  currentUser: User | null;
  authToken: AuthToken | null;
}
export class UserNavPresenter {
  private service: UserService;
  private view: UserNavView;

  public constructor(view: UserNavView) {
    this.view = view;
    this.service = new UserService();
    this.navigateToUser = this.navigateToUser.bind(this);
  }

  public async navigateToUser(event: React.MouseEvent): Promise<void> {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.service.getUser(this.view.authToken!, alias);

      if (!!user) {
        if (this.view.currentUser!.equals(user)) {
          this.view.setDisplayedUser(this.view.currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      console.log(error);
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  public extractAlias(value: string): string {
    console.log("Extracting alias...");
    const index = value.indexOf("@");
    return value.substring(index);
  }
}
