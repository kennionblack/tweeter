import { Status, Type } from "tweeter-shared";
import { Link } from "react-router-dom";
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

const Post = (props: Props) => {
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
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={segment.text}
            onClick={(event) => navigateToUser(event)}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
