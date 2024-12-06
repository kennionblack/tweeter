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
import { AuthToken } from "tweeter-shared";
import { AuthDAO } from "../AuthDAO";

export class AuthDAODynamo implements AuthDAO {
  // partition key is token
  readonly tableName = "auth";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async put(token: AuthToken): Promise<void> {
    const ttl = Math.floor(Date.now() / 1000) + 3600; // This is one hour, chosen arbitrarily
    const params = {
      TableName: this.tableName,
      Item: {
        token: token.token,
        timestamp: token.timestamp,
        ttl: ttl,
      },
    };
    await this.client.send(new PutCommand(params));
  }
  async get(token: AuthToken): Promise<AuthToken> {
    const params = {
      TableName: this.tableName,
      Key: {
        token: token.token,
      },
    };
    const data = await this.client.send(new GetCommand(params));
    if (data.Item === undefined) {
      throw new Error("Token not found");
    }
    return new AuthToken(data.Item.token, data.Item.timestamp);
  }
  async delete(token: AuthToken): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        token: token.token,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }
  async update(token: AuthToken): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        token: token.token,
      },
      UpdateExpression: "SET #timestamp = :timestamp",
      ExpressionAttributeNames: {
        "#timestamp": "timestamp",
      },
      ExpressionAttributeValues: {
        ":timestamp": token.timestamp,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }
  async isAuthorized(token: string): Promise<boolean> {
    try {
      await this.get(new AuthToken(token, 0));
      return true;
    } catch (error) {
      return false;
    }
  }
}
