import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string
  ) => void;
  clearLastInfoMessage: () => void;
  setDisplayedUser: (user: User) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
  setIsLoading: (isLoading: boolean) => void;
}

export class UserInfoPresenter {
  private service: UserService;
  private view: UserInfoView;

  public constructor(view: UserInfoView) {
    this.view = view;
    this.service = new UserService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(
          await this.service.getIsFollowerStatus(
            authToken!,
            currentUser!,
            displayedUser!
          )
        );
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFolloweeCount(
        await this.service.getFolloweeCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setFollowerCount(
        await this.service.getFollowerCount(authToken, displayedUser)
      );
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public switchToLoggedInUser(event: React.MouseEvent): void {
    event.preventDefault();
    this.view.setDisplayedUser(this.view.currentUser!);
  }

  public async followDisplayedUser(
    event: React.MouseEvent,
    user: User
  ): Promise<void> {
    event.preventDefault();
    this.view.setDisplayedUser(user);

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${user!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.follow(
        this.view.authToken!,
        this.view.displayedUser!
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    user: User
  ): Promise<void> {
    event.preventDefault();
    this.view.setDisplayedUser(user);

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${user!.name}...`, 0);

      const [followerCount, followeeCount] = await this.service.unfollow(
        this.view.authToken!,
        this.view.displayedUser!
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
