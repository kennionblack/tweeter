import { AuthDAO } from "./AuthDAO";
import { AuthDAODynamo } from "./aws/AuthDAODynamo";
import { FeedDAODynamo } from "./aws/FeedDAODynamo";
import { FollowDAODynamo } from "./aws/FollowDAODynamo";
import { ImageDAOS3 } from "./aws/ImageDAOS3";
import { StoryDAODynamo } from "./aws/StoryDAODynamo";
import { UserDAODynamo } from "./aws/UserDAODynamo";
import { FeedDAO } from "./FeedDAO";
import { FollowDAO } from "./FollowDAO";
import { ImageDAO } from "./ImageDAO";
import { StoryDAO } from "./StoryDAO";
import { UserDAO } from "./UserDAO";

export interface DAOFactory {
  getAuthDAO(): AuthDAO;
  getFeedDAO(): FeedDAO;
  getFollowDAO(): FollowDAO;
  getStoryDAO(): StoryDAO;
  getUserDAO(): UserDAO;
  getImageDAO(): ImageDAO;
}

export class DAOFactoryAWS implements DAOFactory {
  getAuthDAO(): AuthDAO {
    return new AuthDAODynamo();
  }

  getFeedDAO(): FeedDAO {
    return new FeedDAODynamo();
  }

  getFollowDAO(): FollowDAO {
    return new FollowDAODynamo();
  }

  getStoryDAO(): StoryDAO {
    return new StoryDAODynamo();
  }

  getUserDAO(): UserDAO {
    return new UserDAODynamo();
  }

  getImageDAO(): ImageDAO {
    return new ImageDAOS3();
  }
}
