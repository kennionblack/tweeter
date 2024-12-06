import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Status, User } from "tweeter-shared";
import { FeedDAO } from "../FeedDAO";
import { FeedInfo } from "../../FeedInfo";
import { DataPage } from "../../DataPage";

export class FeedDAODynamo implements FeedDAO {
  // partition key is receiver_alias
  // sort key is timestamp_sender_alias (concatenated)
  tableName = "feeds";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async put(feedInfo: FeedInfo): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.generateFeedItem(feedInfo),
    };
    await this.client.send(new PutCommand(params));
  }

  async get(feedInfo: FeedInfo): Promise<FeedInfo> {
    const params = {
      TableName: this.tableName,
      Key: {
        receiver_alias: feedInfo.followerAlias,
        timestamp_sender_alias: feedInfo.sortKey,
      },
    };
    const data = await this.client.send(new GetCommand(params));
    return data.Item as FeedInfo;
  }

  async getPage(
    receiverAlias: string,
    pageSize: number,
    lastFeedInfo: FeedInfo | null
  ): Promise<DataPage<FeedInfo>> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "receiver_alias = :receiver_alias",
      ExpressionAttributeValues: {
        ":receiver_alias": receiverAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastFeedInfo
        ? {
            receiver_alias: lastFeedInfo.followerAlias,
            timestamp_sender_alias: lastFeedInfo.sortKey,
          }
        : undefined,
    };

    const items: FeedInfo[] = [];
    const data = await this.client.send(new QueryCommand(params));
    data.Items?.forEach((item) => items.push(item as FeedInfo));
    const hasMorePages = data.LastEvaluatedKey !== undefined;

    return new DataPage<FeedInfo>(items, hasMorePages);
  }

  async update(feedInfo: FeedInfo): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        receiver_alias: feedInfo.followerAlias,
        timestamp_sender_alias: feedInfo.sortKey,
      },
      UpdateExpression: "SET #post = :post",
      ExpressionAttributeNames: {
        "#post": "post",
      },
      ExpressionAttributeValues: {
        ":post": feedInfo.post,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  async delete(feedInfo: FeedInfo): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        receiver_alias: feedInfo.followerAlias,
        timestamp_sender_alias: feedInfo.sortKey,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }

  private generateFeedItem(feedInfo: FeedInfo) {
    return {
      follower_alias: feedInfo.followerAlias,
      followee_alias: feedInfo.followeeAlias,
      sort_key: feedInfo.sortKey,
      timestamp: feedInfo.timestamp,
      post: feedInfo.post,
    };
  }
}
