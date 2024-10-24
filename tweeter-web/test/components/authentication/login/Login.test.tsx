import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import React from "react";
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import userEvent from "@testing-library/user-event";
import { library } from "@fortawesome/fontawesome-svg-core";
import "@testing-library/jest-dom";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { mock, instance, verify, anything } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("start with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

    await user.type(aliasField, "wheeeeee");
    await user.type(passwordField, "yay");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign-in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElements("/");

    await user.type(aliasField, "wheeeeee");
    await user.type(passwordField, "yay");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "woohoo");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "https://byu.edu";
    const alias = "@alias";
    const password = "drowssaP";
    const rememberMe = true;

    const { signInButton, aliasField, passwordField, rememberMeCheckbox, user } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);

    await user.type(aliasField, alias);
    await user.type(passwordField, password);
    await user.click(rememberMeCheckbox);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, rememberMe, originalUrl)).once();
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");
  const rememberMeCheckbox = screen.getByLabelText("rememberMe");

  return { signInButton, aliasField, passwordField, rememberMeCheckbox, user };
};
