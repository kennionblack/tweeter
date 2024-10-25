import { LogoutPresenter, LogoutView } from "../../src/presenters/LogoutPresenter";
import { mock, instance, verify, spy, when, capture, anything } from "ts-mockito";
import { AuthToken } from "tweeter-shared";
import { LoginService } from "../../src/model/service/LoginService";

describe("LogoutPresenter", () => {
  let mockLogoutView: LogoutView;
  let logoutPresenter: LogoutPresenter;
  let mockLoginService: LoginService;

  const authToken = new AuthToken("asdf asdf", Date.now());

  beforeEach(() => {
    mockLogoutView = mock<LogoutView>();
    const mockLogoutViewInstance = instance(mockLogoutView);

    mockLoginService = mock<LoginService>();
    const mockLoginServiceInstance = instance(mockLoginService);

    logoutPresenter = new LogoutPresenter(mockLogoutViewInstance);
    logoutPresenter.loginService = mockLoginServiceInstance;
    const logoutSpy = spy(logoutPresenter);
    logoutPresenter = instance(logoutSpy);

    when(logoutSpy.loginService).thenReturn(mockLoginServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLogoutView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the logout service with the correct auth token", async () => {
    await logoutPresenter.logOut(authToken);
    verify(mockLoginService.logout(authToken)).once();

    let [capturedAuthToken] = capture(mockLoginService.logout).last();
    expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the last info message, clear the user infor, and navigate to the login page on successful logout", async () => {
    await logoutPresenter.logOut(authToken);

    verify(mockLogoutView.clearLastInfoMessage()).once();
    verify(mockLogoutView.clearUser()).once();
    verify(mockLogoutView.displayErrorMessage(anything())).never();
  });

  it("displays an error message and does not clear the last info message or clear the user info on unsuccessful logout", async () => {
    const error = new Error("An error occurred");
    when(mockLoginService.logout(authToken)).thenThrow(error);

    await logoutPresenter.logOut(authToken);

    verify(
      mockLogoutView.displayErrorMessage(
        "Failed to log user out because of exception: An error occurred"
      )
    ).once();
    verify(mockLogoutView.clearLastInfoMessage()).never();
    verify(mockLogoutView.clearUser()).never();
  });
});
