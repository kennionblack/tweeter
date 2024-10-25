import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import React from "react";
import { PostPresenter } from "../../../src/presenters/PostPresenter";
import userEvent from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { mock, instance, verify, anything } from "ts-mockito";
import { User, AuthToken } from "tweeter-shared";
import useUserInfoListener from "../../../src/components/userInfo/UserInfoHook";

library.add(fab);

let mockUser = new User("first", "last", "alias", "/");
let mockAuthToken = new AuthToken("token", 14);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  beforeAll(() => {
    (useUserInfoListener as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      authToken: mockAuthToken,
    });
  });

  it("both buttons are disabled when no text in status field", () => {
    const { postStatusButton, clearStatusButton } = renderPostStatusAndGetElements();
    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("both buttons are enabled when text is present in the status field", async () => {
    const { postContent, postStatusButton, clearStatusButton, user } =
      renderPostStatusAndGetElements();

    await user.type(postContent, "filler");

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();
  });

  it("both buttons are disabled when text is cleared from the status field", async () => {
    const { postContent, postStatusButton, clearStatusButton, user } =
      renderPostStatusAndGetElements();

    await user.type(postContent, "filler");

    expect(postStatusButton).toBeEnabled();
    expect(clearStatusButton).toBeEnabled();

    await user.click(clearStatusButton);

    expect(postStatusButton).toBeDisabled();
    expect(clearStatusButton).toBeDisabled();
  });

  it("presenter is called with correct parameters when postStatus is pressed", async () => {
    const mockPresenter = mock<PostPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    mockPresenter;

    const postContentString = "filler";

    const { postContent, postStatusButton, user } =
      renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(postContent, postContentString);
    await user.click(postStatusButton);

    verify(mockPresenter.submitPost(anything(), mockUser, mockAuthToken, postContentString));
  });
});

const renderPostStatus = (presenter?: PostPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postContent = screen.getByLabelText("postContent");
  const postStatusButton = screen.getByRole("button", { name: /postStatusButton/i });
  const clearStatusButton = screen.getByRole("button", { name: /clearStatusButton/i });

  return { postContent, postStatusButton, clearStatusButton, user };
};
