import { User } from "tweeter-shared";
import { Link } from "react-router-dom";
import useUserNavListener from "../UserNavigationHook";
import {
  UserNavView,
  UserNavPresenter,
} from "../../presenters/UserNavPresenter";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "../userInfo/UserInfoHook";

interface Props {
  value: User;
  presenterGenerator: (view: UserNavView) => UserNavPresenter;
}

const UserItem = (props: Props) => {
  const { setDisplayedUser, currentUser, authToken } = useUserInfoListener();
  const { displayErrorMessage } = useToastListener();

  const listener: UserNavView = {
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
    currentUser: currentUser,
    authToken: authToken,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const { navigateToUser } = useUserNavListener(presenter);

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={props.value.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.value.firstName} {props.value.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={props.value.alias}
                onClick={(event) => navigateToUser(event)}
              >
                {props.value.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
