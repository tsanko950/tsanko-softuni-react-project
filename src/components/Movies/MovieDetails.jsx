import { useContext, useEffect, useState, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useForm from "../../hooks/useForm";
import * as firebaseServices from "../../services/firebaseServices";
import {
  convertYouTubeEmbedLink,
  getDuration,
  isValidUrl,
} from "../../utils/utils";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Path from "../../paths";
import AuthContext from "../../contexts/autoContext";
import Comment from "../Comments/Comment";
import reducer from "../Comments/commentReducer";
import Carousel from "../Carousel/Carousel";

export default function MovieDetails() {
  const [movie, setMovie] = useState({});
  const [similarMovies, setSimilarMovie] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [comments, dispatch] = useReducer(reducer, []);
  const { isAuthenticated, userId } = useContext(AuthContext);
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    firebaseServices
      .getAllGenres()
      .then((genresData) => {
        setGenres(genresData);
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  }, []);

  useEffect(() => {
    firebaseServices
      .getMovieById(movieId)
      .then((movieData) => {
        if (movieData) {
          setMovie(movieData);

          firebaseServices.getAllCommentsByMovie(movieId).then((result) => {
            dispatch({
              type: "GET_ALL_COMMENTS",
              payload: result,
            });
          });

          firebaseServices
            .getMoviesByGenre(movieData.genre)
            .then((genresData) => {
              const similarMoviesFiltered = genresData.filter(
                (movie) => movie.id != movieId
              );
              setSimilarMovie(similarMoviesFiltered);
            })
            .catch((error) => {
              console.error("Error fetching genres:", error);
            });
        } else {
          navigate(Path.MoviesList);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [movieId]);

  const addCommentHandler = async (values) => {
    if (isEditMode) {
      commentToEdit.comment = values.comment;
      setCommentToEdit(commentToEdit);
      await firebaseServices.updateComment(commentToEdit.id, values.comment);
      const editedComment = commentToEdit;
      dispatch({
        type: "EDIT_COMMENT",
        payload: editedComment,
      });
    } else {
      const newComment = await firebaseServices.addComment(
        movieId,
        values.comment
      );

      dispatch({
        type: "ADD_COMMENT",
        payload: newComment,
      });
    }

    resetForm();
  };

  const checkAuthenticatedComment = async () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: "You need to sign in for add comment",
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    }
  };

  const removeMovieHandler = async () => {
    Swal.fire({
      title: "Are you sure you want to delete this movie?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const result = firebaseServices.removeMovie(movieId);
        if (result) {
          Swal.fire({
            icon: "success",
            title: "The movie has been deleted successfully",
            showConfirmButton: false,
            timer: 1500,
          }).then(function () {
            navigate(Path.MoviesList);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error occurred deleting movie",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    });
  };

  // SET VALUE IN TEXTAREA
  const editCommentHandler = async (comment) => {
    setIsEditMode(true);
    setCommentToEdit(comment);
    document.getElementById("comment").scrollIntoView({ behavior: "smooth" });
    setEditCommentValue({ comment: comment.comment });
  };

  const { values, onChange, onSubmit, resetForm, setEditCommentValue } =
    useForm(addCommentHandler, {
      comment: "",
    });

  return (
    <>
      <section className="section section--head section--gradient section--details-bg">
        <div
          className="section__bg"
          style={{
            background: isValidUrl(movie.imageUrl)
              ? `url("${movie.imageUrl}") center top / cover no-repeat`
              : "",
          }}
          data-bg={isValidUrl(movie.imageUrl) ? movie.imageUrl : ""}
        />
        <div className="container">
          {/* article */}
          <div className="article">
            <div className="row">
              <div className="col-12 col-xl-8">
                {/* trailer */}
                <a
                  href={isValidUrl(movie.trailerUrl) ? movie.trailerUrl : "#"}
                  className="article__trailer open-video"
                >
                  <svg
                    width={22}
                    height={22}
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11 1C16.5228 1 21 5.47716 21 11C21 16.5228 16.5228 21 11 21C5.47716 21 1 16.5228 1 11C1 5.47716 5.47716 1 11 1Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.0501 11.4669C13.3211 12.2529 11.3371 13.5829 10.3221 14.0099C10.1601 14.0779 9.74711 14.2219 9.65811 14.2239C9.46911 14.2299 9.28711 14.1239 9.19911 13.9539C9.16511 13.8879 9.06511 13.4569 9.03311 13.2649C8.93811 12.6809 8.88911 11.7739 8.89011 10.8619C8.88911 9.90489 8.94211 8.95489 9.04811 8.37689C9.07611 8.22089 9.15811 7.86189 9.18211 7.80389C9.22711 7.69589 9.30911 7.61089 9.40811 7.55789C9.48411 7.51689 9.57111 7.49489 9.65811 7.49789C9.74711 7.49989 10.1091 7.62689 10.2331 7.67589C11.2111 8.05589 13.2801 9.43389 14.0401 10.2439C14.1081 10.3169 14.2951 10.5129 14.3261 10.5529C14.3971 10.6429 14.4321 10.7519 14.4321 10.8619C14.4321 10.9639 14.4011 11.0679 14.3371 11.1549C14.3041 11.1999 14.1131 11.3999 14.0501 11.4669Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Trailer
                </a>
                {/* end trailer */}
                {/* article content */}
                <div className="article__content">
                  <h1>{movie.title}</h1>
                  <ul className="list">
                    <li>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                      </svg>{" "}
                      9.7
                    </li>
                    <li>{movie.year}</li>
                    <li>{getDuration(movie.duration)}</li>
                  </ul>
                  <p>{movie.plot}</p>
                </div>
                {/* end article content */}
              </div>
              {/* video player */}
              <div className="col-12 col-xl-8">
                <div className="plyr plyr--full-ui plyr--video plyr--html5 plyr--fullscreen-enabled plyr--captions-enabled plyr__poster-enabled">
                  {isValidUrl(movie.trailerUrl) && (
                    <iframe
                      width="930"
                      height="523"
                      src={convertYouTubeEmbedLink(movie.trailerUrl)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>

                <div className="article__actions article__actions--details">
                  {/* add .active class */}
                  {isAuthenticated && userId == movie.creator && (
                    <div style={{ display: "flex" }}>
                      <Link
                        className="movie__edit"
                        to={`${Path.CreateEditMovie.replace(
                          ":movieId",
                          movieId
                        )}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 18 18"
                        >
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                        </svg>{" "}
                        Edit
                      </Link>
                      <button
                        className="movie__edit btn-movie-delete"
                        type="button"
                        style={{ marginLeft: "15px" }}
                        onClick={removeMovieHandler}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 18 18"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />{" "}
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>{" "}
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* end video player */}
              <div className="col-12 col-xl-8">
                {/* categories */}
                <div className="categories">
                  <h3 className="categories__title">Genres</h3>
                  {movie.genre &&
                    movie.genre.map((genreId) => (
                      <Link
                        to={Path.MoviesListGenre.replace(":category", genreId)}
                        className="categories__item"
                        key={genreId}
                      >
                        {
                          genres.find((genre) => genre.id == genreId)
                            ?.description
                        }
                      </Link>
                    ))}
                </div>
                {/* end categories */}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-xl-8">
                {/* comments and reviews */}
                <div className="comments">
                  {/* tabs nav */}
                  <ul
                    className="nav nav-tabs comments__title comments__title--tabs"
                    id="comments__tabs"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#tab-1"
                        role="tab"
                        aria-controls="tab-1"
                        aria-selected="true"
                      >
                        <h4>Comments</h4>
                        <span>{comments.length}</span>
                      </a>
                    </li>
                  </ul>
                  {/* end tabs nav */}
                  {/* tabs */}
                  <div className="tab-content">
                    {/* comments */}
                    <div
                      className="tab-pane fade show active"
                      id="tab-1"
                      role="tabpanel"
                    >
                      <ul className="comments__list">
                        {comments.map((comment) => (
                          <Comment
                            key={comment.id}
                            comment={comment}
                            movieID={movieId}
                            dispatch={dispatch}
                            onEdit={() => editCommentHandler(comment)}
                          />
                        ))}
                      </ul>

                      <form onSubmit={onSubmit} className="comments__form">
                        <div className="sign__group">
                          <textarea
                            id="comment"
                            name="comment"
                            className="sign__textarea"
                            placeholder="Add comment"
                            onClick={checkAuthenticatedComment}
                            value={values.comment}
                            onChange={onChange}
                            maxLength={500}
                          />
                        </div>
                        {isAuthenticated && (
                          <button type="submit" className="sign__btn">
                            Send
                          </button>
                        )}
                      </form>
                    </div>
                    {/* end comments */}
                  </div>
                  {/* end tabs */}
                </div>
                {/* end comments and reviews */}
              </div>
            </div>
          </div>
          {/* end article */}
        </div>
      </section>
      {/* end details */}
      {/* similar */}
      {similarMovies.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="section__title">Similar movies</h2>
              </div>
              <div className="col-12">
                <Carousel movies={similarMovies} genres={genres} />
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
