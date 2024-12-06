import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { Status } from "tweeter-shared";
import { StoryDAO } from "../StoryDAO";
import { DataPage } from "../../DataPage";

export class StoryDAODynamo implements StoryDAO {
  // partition key is sender_alias
  // sort key is timestamp as number
  tableName = "stories";
  sortKey: number = 0;

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async put(status: Status): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: this.generateStoryItem(status),
    };
    await this.client.send(new PutCommand(params));
  }
  async get(status: Status): Promise<Status> {
    const params = {
      TableName: this.tableName,
      Key: {
        sender_alias: status.user.alias,
        timestamp: status.timestamp,
      },
    };
    const data = await this.client.send(new GetCommand(params));
    return data.Item as Status;
  }

  async getAll(status: Status): Promise<Status[]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "sender_alias = :sender_alias AND #timestamp >= :timestamp",
      ExpressionAttributeNames: {
        "#timestamp": "timestamp",
      },
      ExpressionAttributeValues: {
        ":sender_alias": status.user.alias,
        ":timestamp": 0,
      },
      ScanIndexForward: true, // This ensures that the results are sorted
    };
    const data = await this.client.send(new QueryCommand(params));
    return data.Items as Status[];
  }

  async getPage(
    alias: string,
    pageSize: number,
    lastStatus: Status | null
  ): Promise<DataPage<Status>> {
    const params = {
      KeyConditionExpression: "sender_alias = :v",
      ExpressionAttributeValues: {
        ":v": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey: lastStatus
        ? {
            sender_alias: lastStatus.user.alias,
            timestamp: lastStatus.timestamp,
          }
        : undefined,
    };

    const items: Status[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item as Status));
    return new DataPage(items, hasMorePages);
  }

  async delete(status: Status): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        sender_alias: status.user.alias,
        timestamp: status.timestamp,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }
  async update(status: Status): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        sender_alias: status.user.alias,
        timestamp: status.timestamp,
      },
      UpdateExpression: "SET #post = :post",
      ExpressionAttributeNames: {
        "#post": "post",
      },
      ExpressionAttributeValues: {
        ":post": status.post,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  private generateStoryItem(status: Status) {
    return {
      sender_alias: status.user.alias,
      timestamp: status.timestamp,
      post: status.post,
    };
  }
}
