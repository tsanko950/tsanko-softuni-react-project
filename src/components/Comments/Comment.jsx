import { Link } from "react-router-dom";
import Path from "../../paths";
import { getDateTime } from "../../utils/utils";
import { useContext, useReducer } from "react";
import AuthContext from "../../contexts/autoContext";
import * as firebaseServices from "../../services/firebaseServices";
import reducer from "../Comments/commentReducer";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function Comment({ movieID, comment, dispatch, onEdit }) {
  const { userId } = useContext(AuthContext);

  const removeCommentHandler = async () => {
    Swal.fire({
      title: "Are you sure you want to delete your comment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        firebaseServices.removeComment(comment.id);
        dispatch({
          type: "DELETE_COMMENT",
          payload: comment.id,
        });
        Swal.fire({
          icon: "success",
          title: "Your comment has been deleted successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  return (
    <li className="comments__item">
      <div className="comments__autor">
        <span className="comments__name">{comment.creatorUsername}</span>
        <span className="comments__time">
          {getDateTime(comment.datetime.seconds)}
        </span>
      </div>
      <p className="comments__text">{comment.comment}</p>
      <div className="comments__actions">
        {userId == comment.creator ? (
          <>
            <button type="button" onClick={onEdit}>
              <svg
                className="yellow-svg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
              >
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
              </svg>{" "}
              <span>Edit</span>
            </button>
            <button type="button" onClick={removeCommentHandler}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                fill="none"
                viewBox="0 0 19 19"
                className="red-svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.596 1.6L1.609 17.587M17.601 17.596l-16-16.003"
                ></path>
              </svg>
              <span>Remove</span>
            </button>
          </>
        ) : (
          <div className="comments__edit"></div>
        )}
      </div>
    </li>
  );
}
