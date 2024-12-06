import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import { User } from "tweeter-shared";
import { UserDAO } from "../UserDAO";
import { UserInfo } from "../../UserInfo";

export class UserDAODynamo implements UserDAO {
  // partition key is user_alias
  tableName = "users";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async put(user: UserInfo): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        user_alias: user.alias,
        first_name: user.firstName,
        last_name: user.lastName,
        password_hash: user.passwordHash,
        user_image_url: user.imageUrl,
        user_image_file_extension: user.imageFileExtension,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async get(user: UserInfo): Promise<UserInfo> {
    const params = {
      TableName: this.tableName,
      Key: {
        user_alias: user.alias,
      },
    };
    const data = await this.client.send(new GetCommand(params));
    if (data.Item === undefined) {
      throw new Error("User not found");
    }
    return new UserInfo(
      data.Item.user_alias,
      data.Item.first_name,
      data.Item.last_name,
      data.Item.password_hash,
      data.Item.user_image_url,
      data.Item.user_image_file_extension
    );
  }

  async getUserByAlias(alias: string): Promise<User> {
    let userInfo = new UserInfo(alias, "", "", "", "", "");
    userInfo = await this.get(userInfo);
    return new User(userInfo.firstName, userInfo.lastName, userInfo.alias, userInfo.imageUrl);
  }

  async login(alias: string): Promise<UserInfo> {
    const user = new UserInfo(alias, "", "", "", "", "");
    const foundUser = await this.get(user);

    return foundUser;
  }

  async delete(user: UserInfo): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        user_alias: user.alias,
      },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async update(user: UserInfo): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        user_alias: user.alias,
      },
      UpdateExpression:
        "set first_name = :fn, last_name = :ln, password_hash = :ph, user_image_url = :iu",
      ExpressionAttributeValues: {
        ":fn": user.firstName,
        ":ln": user.lastName,
        ":ph": user.passwordHash,
        ":iu": user.imageUrl,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  private generateUserItem(user: User) {
    return {
      user_alias: user.alias,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
    };
  }
}
