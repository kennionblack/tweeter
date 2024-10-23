import { mock, instance, verify, spy, when, capture, anything } from "ts-mockito";
import { PostPresenter, StatusView } from "tweeter-web/src/presenters/PostPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";
import React from "react";

describe("PostPresenter", () => {
  let mockStatusView: StatusView;
  let postPresenter: PostPresenter;
  let mockStatusService: StatusService;

  const post: string = "Test post message";
  const authToken = new AuthToken("asdf asdf", Date.now());
  const user = new User("first", "last", "first_last", "/");

  const mockMouseEvent = {
    preventDefault: jest.fn(),
  } as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>;

  beforeEach(() => {
    mockStatusView = mock<StatusView>();
    const mockStatusViewInstance = instance(mockStatusView);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    postPresenter = new PostPresenter(mockStatusViewInstance);
    postPresenter.statusService = mockStatusServiceInstance;
    const postPresenterSpy = spy(postPresenter);
    postPresenter = instance(postPresenterSpy);

    when(postPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await postPresenter.submitPost(mockMouseEvent, user, authToken, post);
    verify(mockStatusView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls postStatus on the post status service with correct status string and auth token", async () => {
    await postPresenter.submitPost(mockMouseEvent, user, authToken, post);

    const [capturedAuthToken, capturedStatus] = capture(mockStatusService.postStatus).last();

    expect(capturedAuthToken).toBe(authToken);
    expect(capturedStatus.post).toBe(post);
    expect(capturedStatus.user).toBe(user);
  });

  it("tells the view to clear the last info message, clear the post, and display a status posted message on successful post", async () => {
    await postPresenter.submitPost(mockMouseEvent, user, authToken, post);

    verify(mockStatusView.clearLastInfoMessage()).once();
    verify(mockStatusView.setPost("")).once();
    verify(mockStatusView.displayInfoMessage("Status posted!", 2000)).once();
    verify(mockStatusView.displayErrorMessage(anything())).never();
  });

  it("tells the view to not clear the last info message, clear the post, nor display a status posted message and post error message on unsuccessful post", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(anything(), anything())).thenThrow(error);

    await postPresenter.submitPost(mockMouseEvent, user, authToken, post);

    verify(mockStatusView.clearLastInfoMessage()).never();
    verify(mockStatusView.setPost("")).never();
    verify(mockStatusView.displayInfoMessage("Status posted!", 2000)).never();
    verify(
      mockStatusView.displayErrorMessage(
        "Failed to post the status because of exception: An error occurred"
      )
    ).once();
  });
});
