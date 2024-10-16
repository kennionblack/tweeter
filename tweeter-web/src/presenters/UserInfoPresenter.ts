import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, MessageView } from "./Presenter";

export interface UserInfoView extends MessageView {
  setDisplayedUser: (user: User) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new UserService();
  }

  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
        );
      }
    }, "determine follower status");
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFolloweeCount(await this.service.getFolloweeCount(authToken, displayedUser));
    }, "get followees count");
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.doFailureReportingOperation(async () => {
      this.view.setFollowerCount(await this.service.getFollowerCount(authToken, displayedUser));
    }, "get followers count");
  }

  public switchToLoggedInUser(event: React.MouseEvent): void {
    event.preventDefault();
    this.view.setDisplayedUser(this.view.currentUser!);
  }

  public async followDisplayedUser(event: React.MouseEvent, user: User): Promise<void> {
    event.preventDefault();
    this.view.setDisplayedUser(user);

    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${user!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.follow(
        this.view.authToken!,
        this.view.displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "follow user");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }

  public async unfollowDisplayedUser(event: React.MouseEvent, user: User): Promise<void> {
    event.preventDefault();
    this.view.setDisplayedUser(user);

    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${user!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.unfollow(
        this.view.authToken!,
        this.view.displayedUser!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "unfollow user");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
