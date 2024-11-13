import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../server/ServerFacade";

export class UserService {
  private serverFacade: ServerFacade;

  public constructor() {
    this.serverFacade = new ServerFacade();
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    const request = {
      alias: alias,
      password: password,
    };

    return await this.serverFacade.login(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request = {
      token: authToken.dto,
    };

    return await this.serverFacade.logout(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

    const request = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };

    return await this.serverFacade.register(request);
  }
}
