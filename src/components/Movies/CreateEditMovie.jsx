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
  }, [movieId]);

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

  if (typeof movieId != "undefined") {
    isUpdate = true;
    useEffect(() => {
      firebaseServices
        .getMovieById(movieId)
        .then((movieData) => {
          if (movieData) {
            // If creator is not some as authenticated user redirect to movies list
            if (movieData.creator != userId) {
              navigate(Path.Home);
            } else {
              setMovieValues(movieData);
            }
          } else {
            navigate(Path.Home);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, [movieId]);
  }

  const changeHandler = (e) => {
    const { name, value, type, checked } = e.target;

    setErrors((state) => ({
      ...state,
      [name]: "",
    }));

    let newValue = value;

    switch (type) {
      case "number":
        newValue = Number(value);
        break;
      case "checkbox":
        if (name.startsWith("genre_")) {
          const genreId = parseInt(name.replace("genre_", ""), 10);
          setMovieValues((state) => {
            const updatedGenre = state.genre.includes(genreId)
              ? state.genre.filter((id) => id !== genreId)
              : [...state.genre, genreId];

            genreValidator(updatedGenre);

            return {
              ...state,
              genre: updatedGenre,
            };
          });

          return;
        } else {
          newValue = checked;
        }

        break;
      default:
        break;
    }

    setMovieValues((state) => ({
      ...state,
      [name]: newValue,
    }));
  };

  const validateField = (fieldName, fieldValue) => {
    switch (fieldName) {
      case "year":
        if (
          isNaN(fieldValue) ||
          fieldValue < 1900 ||
          fieldValue > new Date().getFullYear() + 1
        ) {
          setErrors((state) => ({
            ...state,
            [fieldName]:
              "Year should be a valid year between 1900 and " +
              (new Date().getFullYear() + 1),
          }));
        } else {
          setErrors((state) => ({
            ...state,
            [fieldName]: "",
          }));
        }
        break;
      case "duration":
        if (isNaN(fieldValue) || fieldValue < 1 || fieldValue > 240) {
          setErrors((state) => ({
            ...state,
            [fieldName]:
              "Duration should be a valid duration between 1 and 240 minutes",
          }));
        } else {
          setErrors((state) => ({
            ...state,
            [fieldName]: "",
          }));
        }
        break;

      case "title":
      case "cast":
      case "director":
      case "imageUrl":
      case "plot":
      case "trailerUrl":
        if (fieldValue.trim() === "") {
          setErrors((state) => ({
            ...state,
            [fieldName]: `${
              fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            } is required`,
          }));
        } else {
          setErrors((state) => ({
            ...state,
            [fieldName]: "",
          }));
        }
        break;
      default:
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const validationErrors = {};

    for (const key in movieValues) {
      if (movieValues.hasOwnProperty(key)) {
        validateField(key, movieValues[key]);
      }
    }

    genreValidator();
    if (
      Object.values(errors).some((error) => error !== "") ||
      Object.keys(errors).length === 0
    ) {
      return;
    }

    try {
      movieValues.creator = userId;
      if (isUpdate) {
        const result = firebaseServices.updateMovie(movieId, movieValues);
      } else {
        const result = firebaseServices.addMovie(movieValues);
      }

      navigate(Path.MoviesList);
    } catch (err) {}
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
          duration:
            "Duration should be a valid duration between 1 and 240 minutes",
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

  const genreValidator = (updatedGenre) => {
    const genreToValidate = updatedGenre || movieValues.genre;

    if (genreToValidate.length === 0) {
      setErrors((state) => ({
        ...state,
        genre: "Should select at least one genre",
      }));
    } else {
      setErrors((state) => ({
        ...state,
        genre: "",
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
                        />
                        {errors.title && (
                          <p className={styles.errorMessage}>{errors.title}</p>
                        )}
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
                        {errors.director && (
                          <p className={styles.errorMessage}>
                            {errors.director}
                          </p>
                        )}
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
                        {errors.cast && (
                          <p className={styles.errorMessage}>{errors.cast}</p>
                        )}
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
                        {errors.imageUrl && (
                          <p className={styles.errorMessage}>
                            {errors.imageUrl}
                          </p>
                        )}
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
                        {errors.trailerUrl && (
                          <p className={styles.errorMessage}>
                            {errors.trailerUrl}
                          </p>
                        )}
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
                      </div>
                      {errors.genre && (
                        <p className={styles.errorMessage}>{errors.genre}</p>
                      )}
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
