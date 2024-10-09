import { Link } from "react-router-dom";
import { Status } from "tweeter-shared";
import Post from "./Post";
import useUserNavListener from "../UserNavigationHook";
import { useState } from "react";
import {
  UserNavPresenter,
  UserNavView,
} from "../../presenters/UserNavPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "../userInfo/UserInfoHook";

interface Props {
  status: Status;
  presenterGenerator: (view: UserNavView) => UserNavPresenter;
}

const StatusItem = (props: Props) => {
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
              src={props.status.user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {props.status.user.firstName} {props.status.user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={props.status.user.alias}
                onClick={(event) => navigateToUser(event)}
              >
                {props.status.user.alias}
              </Link>
            </h2>
            {props.status.formattedDate}
            <br />
            <Post
              status={props.status}
              presenterGenerator={function (
                view: UserNavView
              ): UserNavPresenter {
                return new UserNavPresenter(view);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;
