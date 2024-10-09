import "./PostStatus.css";
import { useState } from "react";
import { AuthToken, Status } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoListener from "../userInfo/UserInfoHook";
import { StatusPresenter, StatusView } from "../../presenters/StatusPresenter";

interface Props {
  presenterGenerator: (view: StatusView) => StatusPresenter;
}

const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken } = useUserInfoListener();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: StatusView = {
    displayErrorMessage: displayErrorMessage,
    setIsLoading: setIsLoading,
    setPost: setPost,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
    currentUser: currentUser,
    authToken: authToken,
    post: post,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  /*const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await postStatus(authToken!, status);

      setPost("");
      displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      clearLastInfoMessage();
      setIsLoading(false);
    }
  };*/

  /*const postStatus = async (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> => {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
  };*/

  /*const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };*/

  return (
    <div className={isLoading ? "loading" : ""}>
      <form>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            id="postStatusTextArea"
            rows={10}
            placeholder="What's on your mind?"
            value={post}
            onChange={(event) => {
              setPost(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <button
            id="postStatusButton"
            className="btn btn-md btn-primary me-1"
            type="button"
            disabled={presenter.checkButtonStatus()}
            style={{ width: "8em" }}
            onClick={(event) => presenter.submitPost(event)}
          >
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>Post Status</div>
            )}
          </button>
          <button
            id="clearStatusButton"
            className="btn btn-md btn-secondary"
            type="button"
            disabled={presenter.checkButtonStatus()}
            onClick={(event) => presenter.clearPost(event)}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostStatus;
