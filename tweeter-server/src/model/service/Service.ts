import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../dao/AuthDAO";
import { DAOFactory, DAOFactoryAWS } from "../dao/DAOFactory";
import { FeedDAO } from "../dao/FeedDAO";
import { FollowDAO } from "../dao/FollowDAO";
import { ImageDAO } from "../dao/ImageDAO";
import { StoryDAO } from "../dao/StoryDAO";
import { UserDAO } from "../dao/UserDAO";

export class Service {
  protected DAOFactory: DAOFactory = new DAOFactoryAWS();
  protected authDAO: AuthDAO;
  protected feedDAO: FeedDAO;
  protected followDAO: FollowDAO;
  protected imageDAO: ImageDAO;
  protected storyDAO: StoryDAO;
  protected userDAO: UserDAO;

  public constructor() {
    this.followDAO = this.DAOFactory.getFollowDAO();
    this.authDAO = this.DAOFactory.getAuthDAO();
    this.imageDAO = this.DAOFactory.getImageDAO();
    this.feedDAO = this.DAOFactory.getFeedDAO();
    this.storyDAO = this.DAOFactory.getStoryDAO();
    this.userDAO = this.DAOFactory.getUserDAO();
  }

  protected async authorize(token: string): Promise<void> {
    if (!(await this.authDAO.isAuthorized(token))) {
      throw new Error("Bad Request: Unauthorized");
    }
  }
}
