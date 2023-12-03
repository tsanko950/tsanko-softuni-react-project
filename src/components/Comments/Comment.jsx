import { Link } from "react-router-dom";
import Path from "../../paths";
import { getDateTime } from "../../utils/utils";
export default function Comment({ movieID, comment }) {
  return (
    <li className="comments__item">
      <div className="comments__autor">
        <img className="comments__avatar" src="img/avatar.svg" alt="" />
        <span className="comments__name">{comment.creatorUsername}</span>
        <span className="comments__time">
          {getDateTime(comment.datetime.seconds)}
        </span>
      </div>
      <p className="comments__text">{comment.comment}</p>
      <div className="comments__actions">
        <div className="comments__rate">
          <button type="button">
            <svg
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 7.3273V14.6537"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.6667 10.9905H7.33333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.6857 1H6.31429C3.04762 1 1 3.31208 1 6.58516V15.4148C1 18.6879 3.0381 21 6.31429 21H15.6857C18.9619 21 21 18.6879 21 15.4148V6.58516C21 3.31208 18.9619 1 15.6857 1Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>{" "}
            {comment.negativeVotes}
          </button>
          <button type="button">
            {comment.positiveVotes}{" "}
            <svg
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.6667 10.9905H7.33333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.6857 1H6.31429C3.04762 1 1 3.31208 1 6.58516V15.4148C1 18.6879 3.0381 21 6.31429 21H15.6857C18.9619 21 21 18.6879 21 15.4148V6.58516C21 3.31208 18.9619 1 15.6857 1Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <button type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={512}
            height={512}
            viewBox="0 0 512 512"
          >
            <polyline
              points="400 160 464 224 400 288"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
            />
            <path
              d="M448,224H154C95.24,224,48,273.33,48,332v20"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
            />
          </svg>
          <span>Reply</span>
        </button>
        <button type="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={512}
            height={512}
            viewBox="0 0 512 512"
          >
            <polyline
              points="320 120 368 168 320 216"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
            />
            <path
              d="M352,168H144a80.24,80.24,0,0,0-80,80v16"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
            />
            <polyline
              points="192 392 144 344 192 296"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
            />
            <path
              d="M160,344H368a80.24,80.24,0,0,0,80-80V248"
              style={{
                fill: "none",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 32,
              }}
            />
          </svg>
          <span>Quote</span>
        </button>
      </div>
    </li>
  );
}
