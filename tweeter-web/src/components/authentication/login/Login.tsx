import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../authenticationFields/AuthenticationFields";
import useUserInfoListener from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { AuthView } from "../../../presenters/AuthPresenter";

interface Props {
  originalUrl?: string;
  //presenterGenerator: (view: AuthView) => LoginPresenter;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUser } = useUserInfoListener();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    presenter.doLogin(alias, password, rememberMe, props.originalUrl);
  };

  const listener: AuthView = {
    displayErrorMessage: displayErrorMessage,
    setIsLoading: setIsLoading,
    updateUser: updateUser,
    navigate: navigate,
  };

  const presenter = useMemo(() => {
    return props.presenter || new LoginPresenter(listener);
  }, [listener]);

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          handleLogin={loginOnEnter}
          handleButton={checkSubmitButtonStatus}
          setPassword={setPassword}
          setAlias={setAlias}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
