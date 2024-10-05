import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import { User, AuthToken } from "tweeter-shared";

interface UserInfoListener {
  displayedUser: User | null;
  authToken: AuthToken | null;
  currentUser: User | null;
  updateUser: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  clearUser: () => void;
  setDisplayedUser: (user: User) => void;
}

const useUserInfoListener = (): UserInfoListener => {
  const {
    updateUserInfo,
    clearUserInfo,
    setDisplayedUser,
    displayedUser,
    authToken,
    currentUser,
  } = useContext(UserInfoContext);

  return {
    displayedUser: displayedUser,
    authToken: authToken,
    currentUser: currentUser,
    updateUser: updateUserInfo,
    clearUser: clearUserInfo,
    setDisplayedUser: setDisplayedUser,
  };
};

export default useUserInfoListener;
