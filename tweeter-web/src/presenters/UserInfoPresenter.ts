import { AuthToken, User } from "tweeter-shared";
import { Presenter, MessageView } from "./Presenter";
import React from "react";
import { FollowService } from "../model/service/FollowService";

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
  private service: FollowService;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new FollowService();
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
    this.updateFollowState(true, "follow", this.service.follow.bind(this.service), event, user);
  }

  public async unfollowDisplayedUser(event: React.MouseEvent, user: User): Promise<void> {
    this.updateFollowState(
      false,
      "unfollow",
      this.service.unfollow.bind(this.service),
      event,
      user
    );
  }

  private updateFollowState(
    isFollower: boolean,
    followString: string,
    action: (
      authToken: AuthToken,
      user: User
    ) => Promise<[followerCount: number, followeeCount: number]>,
    event: React.MouseEvent,
    user: User
  ) {
    event.preventDefault();
    this.view.setDisplayedUser(user);

    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(
        `${this.capitalizeFirstCharacter(followString)}ing ${user!.name}...`,
        0
      );

      const [followerCount, followeeCount] = await action(
        this.view.authToken!,
        this.view.displayedUser!
      );

      this.view.setIsFollower(isFollower);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);

      // TODO: if the error occurs after the info message displays, it will not be cleared
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }, `${followString} user`);
  }

  private capitalizeFirstCharacter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
