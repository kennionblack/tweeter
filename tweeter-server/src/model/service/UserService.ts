import { UserDto, AuthTokenDto, User, AuthToken } from "tweeter-shared";
import { Buffer } from "buffer";
import bcrypt from "bcryptjs";
import { UserInfo } from "../UserInfo";
import { Service } from "./Service";

const MAX_SALT_ROUNDS = 3;

export class UserService extends Service {
  public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    let user: UserInfo | User | null = null;
    const foundUser = await this.userDAO.login(alias);
    if (await bcrypt.compare(password, foundUser.passwordHash)) {
      user = foundUser;
    } else {
      throw new Error("Bad Request: Invalid alias or password");
    }

    user = new User(foundUser.firstName, foundUser.lastName, foundUser.alias, foundUser.imageUrl);
    const token = await this.createToken();

    return [user.dto, token.dto];
  }

  public async logout(authToken: AuthTokenDto): Promise<void> {
    await this.authDAO.delete(AuthToken.fromDto(authToken)!);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

    const hashedPassword = await bcrypt.hash(password, MAX_SALT_ROUNDS);

    try {
      await this.userDAO.put(
        new UserInfo(
          alias,
          firstName,
          lastName,
          hashedPassword,
          imageStringBase64,
          imageFileExtension
        )
      );
    } catch (error) {
      throw new Error("Bad Request: Error registering user");
    }

    const user = new User(firstName, lastName, alias, imageStringBase64);
    const token = await this.createToken();

    return [user.dto, token.dto];
  }

  private async createToken(): Promise<AuthToken> {
    const token = AuthToken.Generate();
    await this.authDAO.put(token);
    return token;
  }
}
