import { UserNavPresenter } from "../presenters/UserNavPresenter";

interface UserNavListener {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavListener = (presenter: UserNavPresenter): UserNavListener => {
  return {
    navigateToUser: presenter.navigateToUser,
  };
};

export default useUserNavListener;
