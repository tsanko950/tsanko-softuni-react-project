import { useContext, useEffect, useState } from "react";
import * as firebaseServices from "../../services/firebaseServices";
import styles from "./CreateEditMovie.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Path from "../../paths";
import AuthContext from "../../contexts/autoContext";

let movieInitialState = {
  cast: "",
  director: "",
  duration: 0,
  genre: [],
  imageUrl: "",
  plot: "",
  title: "",
  trailerUrl: "",
  year: 0,
};

const CreateEditMovie = ({ onEdit }) => {
  const [movieValues, setMovieValues] = useState(movieInitialState);
  const { isAuthenticated, userId } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [genres, setGenres] = useState([]);
  const { movieId } = useParams();
  const navigate = useNavigate();

  let isUpdate = false;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(Path.Home);
    }
    //firebaseServices.getMovieByID(movieId).then((result) => setMovie(result));
  }, [movieId]);

  useEffect(() => {
    firebaseServices
      .getAllGenres()
      .then((genresData) => {
        setGenres(genresData);
        console.log(genresData);
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  }, []);

  if (typeof movieId != "undefined") {
    isUpdate = true;
    useEffect(() => {
      firebaseServices
        .getMovieById(movieId)
        .then((movieData) => {
          if (movieData) {
            console.log(movieData);
            setMovieValues(movieData);
          } else {
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, [movieId]);
  }

  const changeHandler = (e) => {
    let value = "";
    let isCheckbox = false;
    switch (e.target.type) {
      case "number":
        value = Number(e.target.value);
        break;
      case "checkbox":
        value = e.target.checked;
        isCheckbox = true;
        break;
      default:
        value = e.target.value;
        break;
    }

    if (isCheckbox == true) {
      const genreId = parseInt(e.target.name.replace("genre_", ""));
      const isChecked = e.target.checked;

      setMovieValues((state) => {
        if (state.genre.includes(genreId) && !isChecked) {
          // Si el género ya está presente y el checkbox se desmarca, lo eliminamos
          return {
            ...state,
            genre: state.genre.filter((id) => id != genreId),
          };
        } else if (!state.genre.includes(genreId) && isChecked) {
          // Si el género no está presente y el checkbox se marca, lo agregamos
          return {
            ...state,
            genre: [...state.genre, genreId],
          };
        }

        return state;
      });
    } else {
      setMovieValues((state) => ({
        ...state,
        [e.target.name]: value,
      }));
    }

    console.log(movieValues);
  };

  const resetFormHandler = () => {
    // setMovieValues(movieInitialState);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    try {
      movieValues.creator = userId;
      if (isUpdate) {
        const result = firebaseServices.updateMovie(movieId, movieValues);
      } else {
        const result = firebaseServices.addMovie(movieValues);
      }

      navigate(Path.MoviesList);
    } catch (err) {
      // Error notification
      console.log(err);
    }
    // resetFormHandler();
  };

  const yearValidator = () => {
    if (!isNaN(movieValues.year)) {
      if (
        movieValues.year < 1900 ||
        movieValues.year > new Date().getFullYear() + 1
      ) {
        setErrors((state) => ({
          ...state,
          year:
            "Year should be between 1900 and " + (new Date().getFullYear() + 1),
        }));
      } else {
        if (errors.year) {
          setErrors((state) => ({
            ...state,
            year: "",
          }));
        }
      }
    } else {
      setErrors((state) => ({
        ...state,
        year: "Year should be a number",
      }));
    }
  };

  const durationValidator = () => {
    if (!isNaN(movieValues.duration)) {
      if (movieValues.duration < 1 || movieValues.duration > 240) {
        setErrors((state) => ({
          ...state,
          duration: "Duration should be between 1 and " + 240 + " min",
        }));
      } else {
        if (errors.duration) {
          setErrors((state) => ({
            ...state,
            duration: "",
          }));
        }
      }
    } else {
      setErrors((state) => ({
        ...state,
        duration: "Duration should be a number",
      }));
    }
  };

  const genreValidator = () => {
    if (movieValues.genre.length == 0) {
      setErrors((state) => ({
        ...state,
        genre: "Should select at least one genre",
      }));
    }
  };

  return (
    <div className="tab-content" id="myTabContent">
      <div
        className="tab-pane fade active show"
        id="tab-1"
        role="tabpanel"
        aria-labelledby="1-tab"
      >
        <div className="col-12">
          <div className="sign__wrap">
            <div className="row">
              <div className="col-12 col-lg-12">
                <form
                  action="#"
                  className="sign__form sign__form--profile sign__form--first"
                  data-select2-id={9}
                >
                  <div className="row" data-select2-id={8}>
                    <div className="col-12">
                      <h4 className="sign__title">Movie details</h4>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="title">
                          Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          name="title"
                          className="sign__input"
                          placeholder="The Godfather"
                          value={movieValues.title}
                          onChange={changeHandler}
                          onBlur={() => console.log("onBlur")}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="director">
                          Director
                        </label>
                        <input
                          id="director"
                          type="text"
                          name="director"
                          className="sign__input"
                          placeholder="Francis Ford Coppola"
                          value={movieValues.director}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="cast">
                          Cast
                        </label>
                        <input
                          id="cast"
                          type="text"
                          name="cast"
                          className="sign__input"
                          placeholder="Marlon Brando, Al Pacino, Andy Garcia"
                          value={movieValues.cast}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="duration">
                          Duration (min)
                        </label>
                        <input
                          id="duration"
                          type="text"
                          name="duration"
                          className={
                            "sign__input" +
                            (errors.duration ? ` ${styles.inputError}` : "")
                          }
                          placeholder="105"
                          onBlur={durationValidator}
                          value={movieValues.duration}
                          onChange={changeHandler}
                        />
                        {errors.duration && (
                          <p className={styles.errorMessage}>
                            {errors.duration}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="imageUrl">
                          Image URL
                        </label>
                        <input
                          id="imageUrl"
                          type="text"
                          name="imageUrl"
                          className="sign__input"
                          placeholder="https://..."
                          value={movieValues.imageUrl}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="trailerUrl">
                          Trailer URL
                        </label>
                        <input
                          id="trailerUrl"
                          type="text"
                          name="trailerUrl"
                          className="sign__input"
                          placeholder="https://..."
                          value={movieValues.trailerUrl}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="year">
                          Release year
                        </label>
                        <input
                          id="year"
                          type="text"
                          name="year"
                          className={
                            "sign__input" +
                            (errors.year ? ` ${styles.inputError}` : "")
                          }
                          placeholder="1972"
                          value={movieValues.year}
                          onBlur={yearValidator}
                          onChange={changeHandler}
                        />
                        {errors.year && (
                          <p className={styles.errorMessage}>{errors.year}</p>
                        )}
                      </div>
                      <div className="sign__group">
                        <label
                          className="sign__label"
                          htmlFor="year"
                          style={{ width: "100%" }}
                        >
                          Genres
                        </label>
                        <br />
                        {genres.map((genre) => (
                          <div
                            className="sign__group sign__group--checkbox"
                            key={genre.id}
                          >
                            <input
                              id={"genre_" + genre.id}
                              name={"genre_" + genre.id}
                              type="checkbox"
                              idgenre={genre.id}
                              onChange={changeHandler}
                              checked={
                                movieValues.genre.includes(
                                  parseInt(genre.id, 10)
                                )
                                  ? "checked"
                                  : ""
                              }
                            />
                            <label
                              className="label-genre"
                              htmlFor={"genre_" + genre.id}
                            >
                              {genre.description}
                            </label>
                          </div>
                        ))}
                        {errors.year && (
                          <p className={styles.errorMessage}>{errors.genre}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-12 col-xl-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="plot">
                          Plot
                        </label>
                        <textarea
                          id="plot"
                          name="plot"
                          style={{ scrollbarWidth: "thin" }}
                          className="sign__textarea"
                          placeholder="In 1945, the New York City Corleone family don, Vito Corleone, listens to requests during his daughter Connie's wedding to Carlo. Vito's youngest son Michael, a forme.."
                          value={movieValues.plot}
                          onChange={changeHandler}
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <button
                        className="sign__btn"
                        disabled={Object.values(errors).some((x) => x)}
                        onClick={submitHandler}
                        type="button"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEditMovie;
