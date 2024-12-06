export class FeedInfo {
  followerAlias: string;
  followeeAlias: string;
  sortKey: string;
  timestamp: number;
  post: string;

  constructor(follower_alias: string, followee_alias: string, timestamp: number, post: string) {
    this.followerAlias = follower_alias;
    this.followeeAlias = followee_alias;
    this.timestamp = timestamp;
    this.post = post;
    this.sortKey = `${new Date(timestamp).toISOString()}_${followee_alias}`;
  }
}
