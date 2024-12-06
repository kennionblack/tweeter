// TODO: create a model that can store regular user info plus password and image info
export class UserInfo {
  alias: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  imageUrl: string;
  imageFileExtension: string;

  constructor(
    alias: string,
    firstName: string,
    lastName: string,
    passwordHash: string,
    imageUrl: string,
    imageFileExtension: string
  ) {
    this.alias = alias;
    this.firstName = firstName;
    this.lastName = lastName;
    this.passwordHash = passwordHash;
    this.imageUrl = imageUrl;
    this.imageFileExtension = imageFileExtension;
  }
}
