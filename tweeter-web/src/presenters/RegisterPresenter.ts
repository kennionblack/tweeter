import { User, AuthToken } from "tweeter-shared";
import { RegisterService } from "../model/service/RegisterService";
import { Buffer } from "buffer";
import { Presenter, View } from "./Presenter";

export interface RegisterView<T> extends View {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (extension: string) => void;
  navigate: (path: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateUser: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export class RegisterPresenter<T> extends Presenter<RegisterView<T>> {
  private registerService: RegisterService;

  public constructor(view: RegisterView<T>) {
    super(view);
    this.registerService = new RegisterService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.registerService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUser(user, user, authToken, rememberMe);
      this.view.navigate("/");
    }, "register user");

    this.view.setIsLoading(false);
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  private getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };
}
