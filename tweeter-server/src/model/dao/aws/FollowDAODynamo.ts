import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDAO } from "../FollowDAO";
import { DataPage } from "../../DataPage";
import { Follow } from "../../Follow";
import { User } from "tweeter-shared";

export class FollowDAODynamo implements FollowDAO {
  readonly tableName = "follows";
  readonly indexName = "follows_index";
  readonly followerHandleAttr = "follower_handle";
  readonly followerNameAttr = "follower_name";
  readonly followeeHandleAttr = "followee_handle";
  readonly followeeNameAttr = "followee_name";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async put(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.generateFollowItem(follow),
    };
    await this.client.send(new PutCommand(params));
  }

  async putBatch(followers: Follow[]): Promise<void> {
    const params = {
      RequestItems: {
        [this.tableName]: followers.map((item) => ({
          PutRequest: {
            Item: this.generateFollowItem(item),
          },
        })),
      },
    };

    await this.client.send(new BatchWriteCommand(params));
  }

  async get(follow: Follow): Promise<Follow> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowKey(follow),
    };
    const data = await this.client.send(new GetCommand(params));
    if (data.Item === undefined) {
      throw new Error("Follow not found");
    }
    return new Follow(
      data.Item[this.followerHandleAttr],
      data.Item[this.followerNameAttr],
      data.Item[this.followeeHandleAttr],
      data.Item[this.followeeNameAttr]
    );
  }

  async getPageOfFollowers(
    followerHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follow>> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followerHandle,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFollowerHandle === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: followerHandle,
              [this.followeeHandleAttr]: lastFollowerHandle,
            },
    };

    const items: Follow[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follow(
          item[this.followerHandleAttr],
          item[this.followerNameAttr],
          item[this.followeeHandleAttr],
          item[this.followeeNameAttr]
        )
      )
    );

    return new DataPage<Follow>(items, hasMorePages);
  }

  async getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follow>> {
    const params = {
      KeyConditionExpression: this.followerHandleAttr + " = :v",
      ExpressionAttributeValues: {
        ":v": followerHandle,
      },
      TableName: this.tableName,
      //IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastFolloweeHandle === undefined
          ? undefined
          : {
              [this.followerHandleAttr]: followerHandle,
              [this.followeeHandleAttr]: lastFolloweeHandle,
            },
    };

    const items: Follow[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push(
        new Follow(
          item[this.followerHandleAttr],
          item[this.followerNameAttr],
          item[this.followeeHandleAttr],
          item[this.followeeNameAttr]
        )
      )
    );

    return new DataPage<Follow>(items, hasMorePages);
  }

  async delete(follow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowKey(follow),
    };
    await this.client.send(new DeleteCommand(params));
  }

  async update(oldFollow: Follow, newFollow: Follow): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: this.generateFollowKey(oldFollow),
      UpdateExpression:
        "SET " +
        this.followerNameAttr +
        " = :follower_name, " +
        this.followeeNameAttr +
        " = :followee_name",
      ExpressionAttributeValues: {
        ":follower_name": newFollow.follower_name,
        ":followee_name": newFollow.followee_name,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  private generateFollowItem(follow: Follow) {
    return {
      [this.followerHandleAttr]: follow.follower_handle,
      [this.followerNameAttr]: follow.follower_name,
      [this.followeeHandleAttr]: follow.followee_handle,
      [this.followeeNameAttr]: follow.followee_name,
    };
  }

  private generateFollowKey(follow: Follow) {
    return {
      [this.followerHandleAttr]: follow.follower_handle,
      [this.followeeHandleAttr]: follow.followee_handle,
    };
  }

  async getByAlias(alias: string): Promise<User | null> {
    const follow = await this.get(new Follow(alias, "", "", ""));
    return this.convertFollowToUser(follow);
  }

  // Note this inserts an empty image, but this should be handled with an ImageDAO call outside of this DAO
  public convertFollowToUser(follow: Follow): User {
    const [firstName, lastName] = follow.follower_name.split(" ");
    return new User(firstName, lastName, follow.follower_handle, "");
  }
}
